import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import s from "./header.module.scss"

const Header = () => {
  const [version, setVersion] = useState('');
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const versionParam = params.get('version');
    if (versionParam) {
      setVersion(versionParam);
    }
  }, [location]);

  return (
    <div className={s.header}>
      <div className={s.navigation}>
        <Link to="sierpinski_1">
          <h3>Варіант 1</h3>
        </Link>
        <Link to="sierpinski_2">
          <h3>Варіант 2</h3>
        </Link>
        <Link to="mandelbrot">
          <h3>mandelbrot</h3>
        </Link>
      </div>

      {version === 'v1' &&
        <>
          {/* <ol>
            <li>Для запуску, клікнути на пустий простір під текстом</li>
            <li><strong>1. Намалюйте великий рівносторонній трикутник.</strong></li>
            <li><strong>2. Виберіть випадкову точку всередині цього трикутника.</strong></li>
            <li><strong>3. Виберіть випадково одну з трьох вершин трикутника.</strong></li>
            <li><strong>4. Перемістіть точку на серидину відрізка.</strong> тепер це наша нова точка</li>
            <li><strong>Повторюйте кроки 3,4 багато разів.</strong></li>
          </ol> */}
        </>
      }

      {version === 'v2' &&
        <>
          {/* <ol>
          <li>Для запуску, клікнути на пустий простір під текстом</li>
          <li><strong>Намалюйте великий рівносторонній трикутник.</strong></li>
          <li><strong>Розділіть цей трикутник на 3 менші рівносторонні трикутники.</strong> Для цього потрібно провести лінії від середини кожної зі сторін великого трикутника до протилежних вершин.</li>
          <li><strong>Видаліть середній трикутник,</strong> залишивши тільки три маленьких трикутники на кутах.</li>
          <li><strong>Повторіть попередні кроки для кожного з трьох малих трикутників.</strong> Ви будете розділяти кожен з них на три нові менші трикутники і так до нескінченності.</li>
        </ol> */}
        </>
      }

    </div >
  );
};

export default Header;