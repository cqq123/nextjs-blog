// import Head from 'next/head'
// import Link from 'next/link'
// import Layout, { siteTitle } from '../components/layout'
// import utilStyles from '../styles/utils.module.css'
// import { getSortedPostsData } from '../lib/posts';

// export default function Home({ allPostsData }) {
//   return (
//     <Layout home>
//       <Head>
//         <title>{siteTitle}</title>
//       </Head>
//       <section className={utilStyles.headingMd}>
//         <Link href="/users">
//           <a>users list</a>
//         </Link>
//       </section>
//       {/* <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
//         <h2 className={utilStyles.headingLg}>Blog</h2>
//         <ul className={utilStyles.list}>
//           {allPostsData.map(({ id, date, title }) => (
//             <li className={utilStyles.listItem} key={id}>
//               <Link href="/posts/[id]" as={`/posts/${id}`}>
//                 <a>{title}</a>
//               </Link>
//               <br />
//               <small className={utilStyles.lightText}>
//                 {date}
//               </small>
//             </li>
//           ))}
//         </ul>
//       </section> */}
//     </Layout>
//   )
// }

// export const getStaticProps = async () => {
//   const allPostsData = getSortedPostsData();
//   return {
//     props: {
//       allPostsData,
//     }
//   }
// }

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

  // const columns = [
  //   {
  //     title: '用户名',
  //     dataIndex: 'name',
  //     key: 'name',
  //     render: (text, record, index) => {
  //       return (
  //         <Input
  //           value={text}
  //           // className={styles.input}
  //           onChange={(e) => setData(data.map((a, i) => index === i ? { ...a, name: e.target.value } : a))}
  //         />
  //       )
  //     }
  //   },
  //   {
  //     title: '密码',
  //     dataIndex: 'password',
  //     key: 'password',
  //     render: (text, record, index) => {
  //       return (
  //         <Input
  //           // className={styles.input}
  //           value={text}
  //           onChange={(e) => setData(data.map((a, i) => index === i ? { ...a, password: e.target.value } : a))}
  //         />
  //       )
  //     }
  //   },
  //   {
  //     title: '备注',
  //     dataIndex: 'remark',
  //     key: 'remark',
  //     render: (text, record, index) => {
  //       return (
  //         <div
  //           className={styles.remark}
  //         >
  //           <Input
  //             // className={styles.input}
  //             value={text}
  //             onChange={(e) => setData(data.map((a, i) => index === i ? { ...a, remark: e.target.value } : a))}
  //           />
  //           <CloseOutlined
  //             className={styles.icon}
  //             onClick={() => handleDelete(record.id, index)}
  //           />
  //         </div>
  //       )
  //     }
  //   }
  // ];
  // return (
  //   <Layout>
  //     <Head>
  //       <title>{siteTitle}</title>
  //     </Head>
  //     <section className={utilStyles.headingMd}>
  //       <Table
  //         columns={columns}
  //         dataSource={data}
  //         className={styles.table}
  //         scroll={{ y: 500 }}
  //       />
  //       <div
  //         className={styles.operate}
  //       >
  //         <Button
  //           onClick={handleAdd}
  //         >添加</Button>
  //         <Button
  //           onClick={handleSave}
  //         >保存</Button>
  //       </div>

  //     </section>
  //   </Layout>
  // )
  return (
    <Layout>
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
                  {/* <div
                    className={styles.remarkContainer}
                  >
                    <input
                      value={item.password}
                      type="password"
                      onChange={(e) => setData(data.map((a, i) => index === i ? { ...a, password: e.target.value } : a))}
                    />
                    <div
                      className={styles.deleteBtn}
                    >
                      显示
                    </div>
                  </div> */}
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