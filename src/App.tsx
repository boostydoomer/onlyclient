import axios from "axios";
import { useState } from "react";
import tg from './assets/tg.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import eng from './assets/icons8-english-48.png';
import rus from './assets/icons8-russia-48.png';
import like from './assets/icons8-like-24.png';

function App() {
  const [nameModel, setNameModel] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [language, setLanguage] = useState<string>('RUSS');

  const handleLanguageChange = (selectedLanguage: string) => {
    setLanguage(selectedLanguage);
  };

  const handleSubmit = async () => {
    if (!nameModel) {
      toast.error('Поле не может быть пустым')
      return;
    }

    const regex = /^[a-zA-Z0-9]+$/;
    if (!regex.test(nameModel)) {
      toast.error("Имя может содержать только буквы и цифры как название аккаунта, только ENG символы и цифры");
      return;
    }

    setIsLoading(true);
    const delay = new Promise(resolve => setTimeout(resolve, 1000)); // Минимальная задержка 1 секунда

    try {
      const response = await axios.post('http://45.130.42.30:5000/api/auth/entername', {
        name: nameModel
      });
      const data = response.data;
      if (response.status === 200) {
        toast.success(`${language === 'RUSS' ? `${nameModel} успешно добавлено в нашу базу данных` : `${nameModel} successfully added to our database`}`);
      } else {
        toast.error(data.message)
      }
    } catch (err: any) {
      if (err.response) {
        toast.error(err.response.data.message || 'Произошла ошибка тут')
      } else {
        toast.error(`${language === 'RUSS' ? 'Произошла ошибка, видимо сервер выключен, если сейчас ночь, то скорее всего он включится к утру' : 'There s been an error, apparently the server is down, if it s nighttime it ll probably be back on by morning'}`);
      }
    } finally {
      await delay;
      setIsLoading(false);
      setNameModel('');
    }
  };

  const handleLike = async () => {
    try {
      const response = await axios.post('http://45.130.42.30:5000/api/auth/like');
  
      const data = response.data;
  
      if (response.status === 200) {
        toast.success(`${language === 'RUSS' ? 'Спасибо за фидбек :)' : 'Thanks for feedback fam'}`);
      } else {
        toast.error(data.message);
      }
    } catch (err: any) {
      if (err.response) {
        toast.error(err.response.data.message || 'Произошла ошибка на сервере');
      } else {
        toast.error('Произошла ошибка, возможно сервер выключен');
      }
    }
  };

  return (
    <div className="mainbody">
      <div className="main_title">
        <h3 className="title">Boosty Hack</h3>
        <div className="buttons_lang">
          <button 
            onClick={() => handleLanguageChange('RUSS')} 
            className={language === 'RUSS' ? 'selected_lang' : ''}
          >
            <img src={rus} alt="Russian" />
          </button>

          <button 
            onClick={() => handleLanguageChange('ENG')} 
            className={language === 'ENG' ? 'selected_lang' : ''}
          >
            <img src={eng} alt="English" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="lds-roller">
          <div></div><div></div><div></div><div></div><div></div>
          <div></div><div></div><div></div>
        </div>
      ) : ''}
      <h1>{language === 'RUSS' ? 'Введите имя аккаунта boosty' : 'Enter account name boosty'}</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <input 
          value={nameModel}
          onChange={(e) => setNameModel(e.target.value)}
          placeholder={language === 'RUSS' ? 'впиши Nickname' : 'Enter Nickname'}
        />
        <button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Загрузка...' : language === 'RUSS' ? 'Отправить' : 'Submit'}
        </button>
      </form>

      <div className="like_section">
        <button onClick={handleLike}>
          <img src={like} alt="Like" />
        </button>
        <h5>{language === 'RUSS' ? 'Нажми если нравится сайт' : 'Click if you like the site'}</h5>
      </div>
      
      <a className="tg" href="https://t.me/boostyhack"><img src={tg} alt="tg" loading="lazy"/><span>{language === 'RUSS' ? 'Присоединяйся если хочешь научиться кодить или получать доступ к boosty' : 'Join if you want to be able to code or get boosty access'}</span></a>

      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}

export default App;
