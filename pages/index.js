import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import { useState } from 'react';
import styles from './users.module.css';
import Password from '../components/password';

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

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section>
        <div className={styles.table}>
          <div className={styles.row}>
            <div>用户名</div>
            <div>密码</div>
            <div>备注</div>
          </div>
          <div className={styles.tableContent}>
            {
              data.map((item, index) => (
                <div className={styles.row} key={index}>
                  <div>
                    <input
                      value={item.name}
                      onChange={(e) => setData(data.map((a, i) => index === i ? { ...a, name: e.target.value } : a))}
                    />
                  </div>
                  <Password
                    value={item.password}
                    handleChange={(e) => setData(data.map((a, i) => index === i ? { ...a, password: e.target.value } : a))}
                  />
                  <div
                    className={styles.remarkContainer}
                  >
                    <input
                      value={item.remark}
                      onChange={(e) => setData(data.map((a, i) => index === i ? { ...a, remark: e.target.value } : a))}
                    />
                    <div
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(item.id, index)}
                    >
                      删除
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
        <div
          className={styles.operate}
        >
          <div
            onClick={handleAdd}
          >添加</div>
          <div
            onClick={handleSave}
          >保存</div>
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
      list,
    }
  }
}