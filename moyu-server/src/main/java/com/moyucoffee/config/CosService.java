package com.moyucoffee.config;

import com.moyucoffee.common.exception.BusinessException;
import com.qcloud.cos.COSClient;
import com.qcloud.cos.ClientConfig;
import com.qcloud.cos.auth.BasicCOSCredentials;
import com.qcloud.cos.model.ObjectMetadata;
import com.qcloud.cos.model.PutObjectRequest;
import com.qcloud.cos.model.CannedAccessControlList;
import com.qcloud.cos.region.Region;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CosService {

    private final CosProperties cosProperties;
    private COSClient cosClient;

    @PostConstruct
    public void init() {
        if (!StringUtils.hasText(cosProperties.getSecretId()) ||
            !StringUtils.hasText(cosProperties.getSecretKey()) ||
            !StringUtils.hasText(cosProperties.getBucket())) {
            log.warn("COS 配置不完整，文件上传将不可用");
            return;
        }
        BasicCOSCredentials cred = new BasicCOSCredentials(
                cosProperties.getSecretId(), cosProperties.getSecretKey());
        ClientConfig config = new ClientConfig(new Region(cosProperties.getRegion()));
        this.cosClient = new COSClient(cred, config);
        log.info("COS 客户端初始化成功, bucket={}, region={}",
                cosProperties.getBucket(), cosProperties.getRegion());
    }

    /**
     * 上传文件到 COS，返回完整访问 URL
     * @param file   上传文件
     * @param prefix 存储路径前缀 (如 "avatar", "product")
     */
    public String upload(MultipartFile file, String prefix) {
        if (cosClient == null) {
            throw new BusinessException("COS 未配置，请联系管理员");
        }

        String ext = getFileExt(file.getOriginalFilename());
        String key = prefix + "/" + System.currentTimeMillis() + "_" +
                UUID.randomUUID().toString().substring(0, 8) + "." + ext;

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());
        metadata.setContentType(file.getContentType());

        try {
            PutObjectRequest request = new PutObjectRequest(
                    cosProperties.getBucket(), key,
                    file.getInputStream(), metadata);
            request.setCannedAcl(CannedAccessControlList.PublicRead);
            cosClient.putObject(request);
            log.info("文件上传成功: {}", key);
        } catch (IOException e) {
            log.error("COS 上传失败", e);
            throw new BusinessException("文件上传失败");
        }

        if (StringUtils.hasText(cosProperties.getBaseUrl())) {
            return cosProperties.getBaseUrl() + "/" + key;
        }
        return "https://" + cosProperties.getBucket() + ".cos." +
                cosProperties.getRegion() + ".myqcloud.com/" + key;
    }

    private String getFileExt(String filename) {
        if (filename == null || !filename.contains(".")) return "png";
        return filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
    }
}
