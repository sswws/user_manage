import React, { useContext } from 'react';
import { Select, Typography, Space } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { LanguageContext, SUPPORTED_LANGUAGES } from '../../utils/i18n';

const { Option } = Select;
const { Text } = Typography;

interface LanguageSelectorProps {
  mode?: 'dropdown' | 'compact';
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ mode = 'dropdown' }) => {
  const { language, setLanguage, t } = useContext(LanguageContext);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  if (mode === 'compact') {
    return (
      <Select
        value={language}
        onChange={handleLanguageChange}
        size="small"
        style={{ width: 100 }}
        suffixIcon={<GlobalOutlined />}
      >
        {SUPPORTED_LANGUAGES.map(lang => (
          <Option key={lang.code} value={lang.code}>
            {lang.name}
          </Option>
        ))}
      </Select>
    );
  }

  return (
    <Space>
      <Text type="secondary"><GlobalOutlined /> 语言：</Text>
      <Select
        value={language}
        onChange={handleLanguageChange}
        style={{ width: 120 }}
      >
        {SUPPORTED_LANGUAGES.map(lang => (
          <Option key={lang.code} value={lang.code}>
            {lang.name}
          </Option>
        ))}
      </Select>
    </Space>
  );
};

export default LanguageSelector;