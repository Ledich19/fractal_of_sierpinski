import React, { forwardRef, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import s from "./header.module.scss"

// Компонент Header оборачивается forwardRef
const Header = forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>((_, ref) => {
  const [version, setVersion] = useState('');
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const versionParam = params.get('version');

    if (versionParam === 'v1' || versionParam === 'v2') {
      setVersion(versionParam);
    } else if (location.pathname === '/v1') {
      setVersion('v1');
    } else if (location.pathname === '/v2') {
      setVersion('v2');
    }
  }, [location]);

  return (
    <div ref={ref}>
      <div className={s.navigation}>
        <Link to="v1">
          <h3>Варіант 1</h3>
        </Link>
        <Link to="v2">
          <h3>Варіант 2</h3>
        </Link>
      </div>

      {version === 'v1' &&
        <>
          <ol>
            <li>Для запуску, клікнути на пустий простір під текстом</li>
            <li><strong>Намалюйте великий рівносторонній трикутник.</strong> Це буде ваша основа для фрактала.</li>
            <li><strong>Виберіть випадкову точку всередині цього трикутника.</strong></li>
            <li><strong>Виберіть одну з трьох вершин трикутника.</strong> Вибір вершини має бути випадковим.</li>
            <li><strong>Перемістіть поточну точку на серидину відрізка.</strong></li>
            <li><strong>Повторюйте попередні кроки багато разів.</strong> З часом точка почне рухатись по фрактальному шляху, формуючи малюнок фрактала Серпінського.</li>
          </ol></>
      }

      {version === 'v2' && <>
        <ol>
          <li>Для запуску, клікнути на пустий простір під текстом</li>
          <li><strong>Намалюйте великий рівносторонній трикутник.</strong> Це буде ваша основа для побудови фрактала.</li>
          <li><strong>Розділіть цей трикутник на 3 менші рівносторонні трикутники.</strong> Для цього потрібно провести лінії від середини кожної зі сторін великого трикутника до протилежних вершин.</li>
          <li><strong>Видаліть середній трикутник,</strong> залишивши тільки три маленьких трикутники на кутах.</li>
          <li><strong>Повторіть попередні кроки для кожного з трьох малих трикутників.</strong> Ви будете розділяти кожен з них на три нові менші трикутники і так до нескінченності.</li>
          <li><strong>Продовжуйте розділяти, поки не отримаєте бажану деталізацію.</strong> Фрактал буде виглядати як нескінченний набір зменшуваних трикутників.</li>
        </ol></>
      }

    </div >
  );
});

export default Header;