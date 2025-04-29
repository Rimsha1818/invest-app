import React, { useEffect, useState } from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import { Table, Button, message, Spin, Progress } from 'antd';
import { getBackups } from '../../services/backup';
import { useSelector } from 'react-redux';

const BackupList = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadProgress, setDownloadProgress] = useState({}); // Track progress per download
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const fetchBackups = async () => {
      try {
        const backupData = await getBackups();
        setBackups(backupData.files); // Use "files" from the response
        setFetchError(false);
      } catch (error) {
        message.error('Failed to fetch backups');
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBackups();
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Download',
      key: 'download',
      render: (record) => (
        <Button
          onClick={() => handleDownload(record.download_url, record.name)} // Pass name for filename
          type="primary"
          icon={<DownloadOutlined />}
          loading={downloadProgress[record.name]?.loading} // Show loading per file
        >
          {downloadProgress[record.name]?.loading ? `${downloadProgress[record.name].percent}%` : 'Download'}
        </Button>
      ),
    },
  ];


  const handleDownload = async (downloadUrl, fileName) => {
    setDownloadProgress(prevProgress => ({
      ...prevProgress,
      [fileName]: { loading: true, percent: 0 },
    }));

    try {
      const response = await fetch(downloadUrl, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }


      const contentLength = response.headers.get('Content-Length');
      const total = parseInt(contentLength, 10);
      let loaded = 0;

      const reader = response.body.getReader();
      const stream = new ReadableStream({
        start(controller) {
          return pump();
          function pump() {
            return reader.read().then(({ done, value }) => {
              if (done) {
                controller.close();
                return;
              }
              loaded += value.length;
              const percent = Math.round((loaded / total) * 100);
              setDownloadProgress(prevProgress => ({
                ...prevProgress,
                [fileName]: { loading: true, percent },
              }));
              controller.enqueue(value);
              return pump();
            });
          }
        }
      });



      const blob = await new Response(stream).blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);


      link.setAttribute('download', fileName); // Use the correct filename here
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(link.href);

      message.success(`Backup ${fileName} downloaded successfully!`);
    } catch (error) {
      console.error('Error downloading file:', error);
      message.error(`Failed to download ${fileName}`);
    } finally {
      setDownloadProgress(prevProgress => ({
        ...prevProgress,
        [fileName]: { loading: false }, // Reset loading after download finishes
      }));
    }
  };



  return (
    <div>
      <Spin tip="Loading backups..." spinning={loading}>
        {!loading && !fetchError && (
          <Table
            columns={columns}
            dataSource={backups}
            rowKey={(record) => record.name} // Use name as the rowKey
          />
        )}
        {fetchError && <div>Failed to load backups. Please try again later.</div>}
      </Spin>
    </div>
  );
};

export default BackupList;