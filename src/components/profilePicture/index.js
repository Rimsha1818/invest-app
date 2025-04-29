import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Upload, Avatar, Spin, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import env from './../../env';
import './index.css';
import { updateAvatar } from '../../redux/userSlice';

function ProfilePictureComponent({ user_id, size }) {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [defaultPicture, setDefaultPicture] = useState(null);

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const props = {
    name: 'profile_photo_path',
    action: `${env.API_URL}/profile-picture/${user_id}`,
    method: 'post',
    accept: '.jpg,.jpeg,.png,.gif',
    showUploadList: false,
    listType: 'picture-card',
    className: 'avatar-uploader',
    headers: {
      authorization: `Bearer ${currentUser.token}`,
    },
    onChange(info) {
      if (info.file.status === 'uploading') {
        setLoading(true);
      } else if (info.file.status === 'done') {
          setLoading(false);
          getBase64(info.file.originFileObj, (url) => {
            setDefaultPicture(url);
            dispatch(updateAvatar(url));
          });
      } else if (info.file.status === 'error') {
        setLoading(false);
      }
    },
  };

  return (
    <Spin spinning={loading}>
      <ImgCrop showGrid rotationSlider>
        <Upload {...props}>
          {defaultPicture ? (
            <Avatar size={size} src={`${defaultPicture}`} />
          ) : (
            <Avatar
        size={size}
        icon={<UserOutlined />}
        src={
          currentUser.profile_photo_path?.startsWith("profiles")
            ? `${env.DOMAIN_URL}/uploads/${currentUser.profile_photo_path}`
            : `${currentUser.profile_photo_path}`
        }
      />
    )}
        </Upload>
      </ImgCrop>
    </Spin>
  );
}

export default ProfilePictureComponent;
