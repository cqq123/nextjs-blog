import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { Table, Input, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useState } from 'react';
import styles from './users.module.css';

export default function Users({ list }) {
  const [data, setData] = useState(list);

  const handleAdd = () => {
    setData([
      ...data,
      {
        name: '',
        password: '',
        remark: '',
      }
    ])
  }
  const handleSave = () => {
    fetch('http://127.0.0.1:3000/save', {
      method: 'POST',
      body: JSON.stringify({
        users: data,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
      .then(res => {
        if (res.success) {
          window.alert('修改成功');
        }
      });
  }

  const handleDelete = (id, index) => {
    if (id) {
      fetch(`http://127.0.0.1:3000/delete/${id}`, {
        method: 'POST',
      }).then((res) => res.json())
        .then((res) => setData(res.data));
    } else {
      setData(data.filter((a, i) => i !== index));
    }
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
      render: (text, record, index) => {
        return (
          <Input
            value={text}
            // className={styles.input}
            onChange={(e) => setData(data.map((a, i) => index === i ? { ...a, name: e.target.value } : a))}
          />
        )
      }
    },
    {
      title: '密码',
      dataIndex: 'password',
      key: 'password',
      render: (text, record, index) => {
        console.log(text, record)
        return (
          <Input
            // className={styles.input}
            value={text}
            onChange={(e) => setData(data.map((a, i) => index === i ? { ...a, password: e.target.value } : a))}
          />
        )
      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      render: (text, record, index) => {
        return (
          <div
            className={styles.remark}
          >
            <Input
              // className={styles.input}
              value={text}
              onChange={(e) => setData(data.map((a, i) => index === i ? { ...a, remark: e.target.value } : a))}
            />
            <CloseOutlined
              className={styles.icon}
              onClick={() => handleDelete(record.id, index)}
            />
          </div>
        )
      }
    }
  ];
  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <Table
          columns={columns}
          dataSource={data}
          className={styles.table}
          scroll={{ y: 500 }}
        />
        <div
          className={styles.operate}
        >
          <Button
            onClick={handleAdd}
          >添加</Button>
          <Button
            onClick={handleSave}
          >保存</Button>
        </div>

      </section>
    </Layout>
  )
}

export const getStaticProps = async () => {
  const list = await fetch('http://127.0.0.1:3000/list')
    .then(res => res.json())
    .then(res => res.data);
  return {
    props: {
      list
    }
  }
}