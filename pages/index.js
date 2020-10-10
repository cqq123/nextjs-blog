import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import { useState } from 'react';
import styles from './users.module.css';
import Password from '../components/password';
const { handleDecipher } = require('../lib/crypto');

export default function Users(obj) {
  const [data, setData] = useState(obj.list);

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
    fetch('/save', {
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
      fetch(`/delete/${id}`, {
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

export const getServerSideProps = async ({ req }) => {
  const result = req.db.get('users').value().map((a) => ({
    ...a,
    password: handleDecipher(a.password),
  }));

 return {
   props: {
     list: result || [],
   },
 }
}
