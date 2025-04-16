import React, { useState, useEffect } from 'react';
import { LanguageContext, translate, languageUtils } from '../../utils/i18n';

interface LanguageProviderProps {
  children: React.ReactNode;
}

const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState(languageUtils.getDefaultLanguage());

  // 设置语言并保存到本地存储
  const setLanguage = (code: string) => {
    setLanguageState(code);
    languageUtils.saveLanguage(code);
  };

  // 翻译函数
  const t = (key: string) => {
    return translate(language, key);
  };

  // 提供语言上下文
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;