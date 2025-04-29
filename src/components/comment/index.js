import React, { useState, useEffect, useRef } from 'react';
import {
  List,
  Input,
  Avatar,
  Button,
  Upload,
  Tag,
  Modal,
  Row,
  Col,
  notification,
  Form,
  Space,
  Mentions,
} from 'antd';
import { Comment } from '@ant-design/compatible';
import { InboxOutlined, CloseOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getFileNameFromPath, downloadFile } from '../../utils/helper';
import './index.css';
import commentService from '../../services/comment';
// import FileViewer from 'react-file-viewer';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import userService from '../../services/user';

const { getMentions } = Mentions;

const CommentSystem = ({ id, form_id, status, comment_status }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [attachmentList, setAttachmentList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [newCommentAdded, setNewCommentAdded] = useState(false);
  const [form] = Form.useForm();
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [docs, setDocs] = useState({
    uri: '',
    fileType: '',
    fileName: '',
  });

  const [mentionedUsers, setMentionedUsers] = useState([]);
  const mentionInputRef = useRef(null);

  const fetchFileInfo = (attachmentUrl) => {
    const fileType = getFileTypeFromUrl(attachmentUrl);
    setDocs({ uri: attachmentUrl, fileType: fileType, fileName: getFileNameFromPath(attachmentUrl) });
    setIsModalVisible(true);
  };

  const getFileTypeFromUrl = (url) => {
    const extension = url.split('.').pop().toLowerCase();
    switch (extension) {
      case 'jpg':
        return 'jpg';
      case 'jpeg':
        return 'jpeg';
      case 'png':
        return 'png';
      case 'gif':
        return 'gif';
      case 'doc':
        return 'doc';
      case 'docx':
        return 'doc';
      case 'xls':
        return 'xls';
      case 'xlsx':
        return 'xls';
      case 'ppt':
        return 'ppt';
      case 'pptx':
        return 'ppt';
      case 'pdf':
        return 'pdf';
      case 'txt':
        return 'txt';
      default:
        return '';
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const getComments = async () => {
      setLoading(true);
      try {
        const response = await commentService.getComments(id, form_id);
        setComments(response);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    getComments();
  }, [id]);

  const handleSearchUsers = async (query) => {
    if (query.length >= 2) {
      try {
        const response = await userService.searchUsers(query);
        const suggestions = response.data.map((user) => ({
          value: user.name,
          label: user.name,
          id: user.id
        }));
        setMentionSuggestions(suggestions);
      } catch (error) {
        console.error("Error searching users:", error);
      }
    } else {
      setMentionSuggestions([]);
    }
  };

  const handleMentionSelect = (option) => {
    const user = mentionSuggestions.find(user => user.value === option.value);
    if (user && !mentionedUsers.some(mentionedUser => mentionedUser.id === user.id)) {
      setMentionedUsers([...mentionedUsers, user]);
    }
  };

  const handleMentionChange = (contentState) => {
    setNewComment(contentState);
  };

  const handleTagClose = (removedUserId) => {
    setMentionedUsers(mentionedUsers.filter(user => user.id !== removedUserId));
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList((prevFileList) => {
        return prevFileList ? [...prevFileList, file] : [file];
      });
      return false;
    },
    fileList,
  };

  const handleAddComment = async () => {
    form.validateFields().then(async (values) => {
      if (newComment || fileList.length > 0) {
        const timestamp = moment().format('MMMM Do YYYY, h:mm a');
        const formData = new FormData();
        formData.append('form_id', form_id);
        formData.append('key', id);
        formData.append('comment', newComment ? newComment : '-');
        formData.append('timestamp', timestamp);
        formData.append('mentioned_user_ids', JSON.stringify(mentionedUsers.map(user => user.id)));
        if (fileList) {
          fileList.forEach((file, index) => {
            formData.append(`attachments[${index}]`, file);
          });
        }
        if (!newComment.trim() && fileList.length === 0) {
          notification.error({
            message: 'Comment or Attachment Required',
            description: 'Please enter a comment or upload an attachment.',
          });
          return;
        }
        setLoading(true);

        try {
          const response = await commentService.postComments(formData);
          setLoading(false);
          setFileList([]);
          setNewComment('');
          setAttachmentList([]);
          setNewCommentAdded(true);
          form.resetFields();
          setMentionedUsers([]);
          setTimeout(() => {
            setComments([...comments, response.data]);
          }, 500);

          notification.success({
            message: 'Comment Added',
            description: 'Comment added successfully',
          });
        } catch (error) {
          console.log(error);
          setNewComment('');
          setLoading(false);
        } finally {
          setFileList([]);
        }
      }
    }).catch((error) => {
      console.error("Validation failed:", error);
    });
  };

  const toggleUploader = () => {
    setShowUploader(!showUploader);
    setNewCommentAdded(true);
  };

  return (
    <Row gutter={16}>
      <Col span={24}>
        {comments && comments.length > 0 && (
          <List
            header={`${comments.length} Comments`}
            itemLayout="horizontal"
            dataSource={comments}
            renderItem={(comment, index) => (
              <li key={index} className={newCommentAdded ? 'elementToFadeInAndOut' : null}>
                <Comment
                  author={comment.user.name}
                  avatar={<Avatar src="user-avatar-url" />}
                  content={<>{comment.comment}</>}
                  datetime={moment(comment.created_at).format('MMMM Do YYYY, h:mm a')}
                />
                <div>
                  {comment.comment_attachments && comment.comment_attachments.length > 0 ? (
                    comment.comment_attachments.map((attachment, i) => (
                      <div key={`${comment.id}-${i}`}>
                        <Tag className="pb-4 pt-10 mb-4">
                          <b>Title: {attachment.original_title || getFileNameFromPath(attachment.fileName)} </b>
                          <div style={{ marginTop: '10px' }}>
                            <Space direction='horizontal'>
                              <Button
                                size="small"
                                className="mb-10"
                                type="primary"
                                onClick={() => downloadFile(attachment.filename)}
                              >
                                Download
                              </Button>
                            </Space>

                            <Modal
                              title="File Preview"
                              visible={isModalVisible}
                              onCancel={handleCancel}
                              footer={null}
                              width={800}
                            >
                              type: {docs.fileType}
                              <br />
                              path: {docs.uri}
                              <br />
                              filename: {docs.fileName}

                              <DocViewer renderers={DocViewerRenderers} documents={[docs]} style={{ height: 500 }} />
                            </Modal>
                          </div>
                        </Tag>
                      </div>
                    ))
                  ) : null}
                </div>
              </li>
            )}
          />
        )}

{comment_status === 1 && (

        <div className="add-comment-box">
          <Form form={form} onFinish={handleAddComment}>
            <Form.Item
              name="comment"
              // rules={[{ required: true, message: 'Please enter a comment or mention someone' }]}
            >
              {/* <Mentions
                ref={mentionInputRef}
                rows={3}
                maxLength={151}
                style={{ width: '100%' }}
                onSearch={handleSearchUsers}
                onChange={handleMentionChange}
                onSelect={handleMentionSelect}
                value={newComment}
                placeholder="Type '@' to mention someone"
              >
                {mentionSuggestions.map((suggestion) => (
                  <Mentions.Option key={suggestion.id} value={suggestion.value}>
                    {suggestion.label}
                  </Mentions.Option>
                ))}
              </Mentions> */}
              <Mentions
                ref={mentionInputRef}
                rows={3}
                maxLength={151}
                style={{ width: '100%' }}
                onSearch={handleSearchUsers}
                onChange={handleMentionChange}
                onSelect={handleMentionSelect}
                value={newComment}
                options={mentionSuggestions} // Use the options prop
                placeholder="Type '@' to mention someone"
              />

            </Form.Item>

            <div className="mention-tags">
              {mentionedUsers.map((user) => (
                <Tag
                  key={user.id}
                  closable
                  onClose={() => handleTagClose(user.id)}
                  closeIcon={<CloseOutlined />}
                >
                  {user.label}
                </Tag>
              ))}
            </div>

            <Form.Item>
              <Upload.Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Drag and drop files here or click to upload</p>
              </Upload.Dragger>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                Add Comment
              </Button>&nbsp;&nbsp;
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                Add Attachment
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}

      </Col>
    </Row>
  );
};

export default CommentSystem;
