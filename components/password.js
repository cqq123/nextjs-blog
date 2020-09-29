import styles from '../pages/users.module.css';
import { useState } from 'react';

export default function Password({ value, handleChange }) {
  const [isShow, setShow] = useState(false);
  return (
    <div
      className={styles.remarkContainer}
    >
      <input
        value={value}
        type={isShow ? 'text' : 'password'}
        onChange={handleChange}
        // onChange={(e) => setData(data.map((a, i) => index === i ? { ...a, password: e.target.value } : a))}
      />
      <div
        className={styles.deleteBtn}
        onClick={() => setShow(!isShow)}
      >
        { isShow ? '隐藏' : '显示'}
      </div>
    </div>
  )
}