import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Form,
  Input,
  Radio,
  Select,
  DatePicker,
  Row,
  Col,
  Table,
  Checkbox,
  Divider,
} from 'antd';
import '../styles/App.scss';
import { nationalitiesEn, countryCodes } from '../utils/data';
import {
  setPrefix,
  setFirstName,
  setLastName,
  setFullName,
  setBirthday,
  setNationality,
  setIdNumber,
  setGender,
  setTel,
  setPassport,
  setExpectedSalary,
} from '../redux/formSlice';
import EditForm from './EditForm';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { RootState } from '../redux/store';

type FormData = {
  prefix: string;
  firstName: string;
  lastName: string;
  fullName: string;
  birthday: string;
  tel: string;
  nationality: string;
  idNumber: string;
  gender: string;
  passport: string;
  expectedSalary: string;
  key: string;
};

type LanguageObject = {
  [key: string]: { nativeName: string };
};

function App(): JSX.Element {
  const [idParts, setIdParts] = useState<string[]>(['', '', '', '', '']);
  const [telParts, setTelParts] = useState<string[]>(['', '']);
  const [dataSource, setDataSource] = useState<FormData[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState({});
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('th');
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.formData);
  const [form] = Form.useForm();
  const { t, i18n } = useTranslation();
  const lngs: LanguageObject = {
    en: { nativeName: 'English' },
    th: { nativeName: 'Thai' },
  };

  useEffect(() => {
    if (i18n.resolvedLanguage === 'th') {
      setCurrentLanguage('th');
    } else {
      setCurrentLanguage('en');
    }
  }, [i18n.resolvedLanguage]);

  const handleLangChange = (value: string) => {
    if (lngs[value]) {
      i18n.changeLanguage(value);
    }
  };

  const onReset = () => {
    form.resetFields();
    setIdParts(['', '', '', '', '']);
    setTelParts(['', '']);
  };

  const handleInputChange = useCallback(
    (name: string, value: string) => {
      switch (name) {
        case 'prefix':
          dispatch(setPrefix(value));
          break;
        case 'firstName':
          dispatch(setFirstName(value));
          break;
        case 'lastName':
          dispatch(setLastName(value));
          break;
        case 'birthday':
          dispatch(setBirthday(value));
          break;
        case 'nationality':
          dispatch(setNationality(value));
          break;
        case 'gender':
          dispatch(setGender(value));
          break;
        case 'tel':
          dispatch(setTel(value));
          break;
        case 'passport':
          dispatch(setPassport(value));
          break;
        case 'expectedSalary':
          dispatch(setExpectedSalary(value));
          break;
        default:
          break;
      }
    },
    [dispatch],
  );

  const handleInputChangeId = (
    userInput: string,
    value: string,
    index: number,
    maxLength: number,
  ) => {
    const idPartsClone = [...idParts];
    if (userInput === 'deleteContentBackward') {
      idPartsClone[index] = idPartsClone[index].slice(0, -1);
      if (index > 0 && idParts[index].trim().length === 1) {
        const prevIndex = index - 1;
        document.getElementById(`input-${prevIndex}`)?.focus();
      }
    } else {
      const numericValue = value.replace(/\D/g, '');
      if (index < 4 && numericValue.length === maxLength) {
        const nextIndex = index + 1;
        if (nextIndex < idParts.length) {
          document.getElementById(`input-${nextIndex}`)?.focus();
        }
      }
      idPartsClone[index] = numericValue;
    }
    const combinedParts = idPartsClone.join('');
    setIdParts(idPartsClone);
    dispatch(setIdNumber(combinedParts));
  };

  const handleInputChangeTel = (value: string, index: number) => {
    const numericValue = value.replace(/[^\d-\s]/g, '');
    const telPartsClone = [...telParts];
    if (index === 0) {
      telPartsClone[index] = value;
    } else {
      telPartsClone[index] = numericValue;
    }
    setTelParts(telPartsClone);
    const combinedParts = telPartsClone.join(' ');
    dispatch(setTel(combinedParts));
  };

  const columns = [
    {
      title: t('input.fullName'),
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a: FormData, b: FormData) =>
        a.fullName.localeCompare(b.fullName),
    },
    {
      title: t('input.gender'),
      dataIndex: 'gender',
      key: 'gender',
      sorter: (a: FormData, b: FormData) => a.gender.localeCompare(b.gender),
    },
    {
      title: t('input.tel'),
      dataIndex: 'tel',
      key: 'tel',
      sorter: (a: FormData, b: FormData) => {
        const telA = a.tel.replace(/[^\d]/g, '');
        const telB = b.tel.replace(/[^\d]/g, '');
        return parseInt(telA) - parseInt(telB);
      },
    },
    {
      title: t('input.nationality'),
      dataIndex: 'nationality',
      key: 'nationality',
      sorter: (a: FormData, b: FormData) =>
        a.nationality.localeCompare(b.nationality),
    },
    {
      title: t('action.actions'),
      dataIndex: 'action',
      key: 'action',
      render: (_text: string, record: FormData) => (
        <span>
          <Button onClick={() => handleEdit(record)}>{t('action.edit')}</Button>
          <Divider type='vertical' />
          <Button onClick={() => handleDelete(record.key)}>
            {t('action.delete')}
          </Button>
          <Divider type='vertical' />
          <Checkbox
            checked={selectedItems.includes(record.key)}
            onChange={() => handleSelectItem(record.key)}
          >
            {t('action.select')}
          </Checkbox>
        </span>
      ),
    },
  ];

  const handleEdit = (record: FormData) => {
    setModalIsOpen(true);
    setItemToEdit(record);
  };

  const handleDelete = (key: string) => {
    const updatedData = dataSource.filter((item) => {
      return item.key !== key;
    });
    localStorage.setItem('dataCollection', JSON.stringify(updatedData));
    setDataSource(updatedData);
    const newSelectedItems = selectedItems.filter((item) => item !== key);
    setSelectedItems(newSelectedItems)
  };

  const handleSelectItem = (key: string) => {
    if (!selectedItems.includes(key)) {
      setSelectedItems((prev) => {
        return [...prev, key];
      });
    } else {
      const newSelectedItems = selectedItems.filter((item) => item !== key);
      setSelectedItems(newSelectedItems);
    }
  };

  const handleSelectAllItems = () => {
    if (!isSelectAll) {
      dataSource.map((item) => {
        setSelectedItems((prev) => {
          return [...prev, item.key];
        });
      });
      setIsSelectAll(true);
    } else {
      setSelectedItems([]);
      setIsSelectAll(false);
    }
  };

  useEffect(() => {
    const savedData = localStorage.getItem('dataCollection');
    if (savedData && savedData.length !== 0) {
      const parsedData = JSON.parse(savedData);
      const dataSource = parsedData.map((item: FormData, index: number) => ({
        ...item,
        key: index.toString(),
      }));
      setDataSource(dataSource);
    } else {
      localStorage.setItem('dataCollection', JSON.stringify([]));
    }
  }, []);

  const saveFormDataToLocalStorage = (formData: FormData) => {
    const savedDataString = localStorage.getItem('dataCollection');
    const savedData: FormData[] = savedDataString
      ? JSON.parse(savedDataString)
      : [];
    if (savedData) {
      const updatedData = [...savedData, formData];
      const updatedDataWithKey = updatedData.map((item, index) => ({
        ...item,
        key: index.toString(),
      }));
      localStorage.setItem(
        'dataCollection',
        JSON.stringify(updatedDataWithKey),
      );
      setDataSource(updatedDataWithKey);
      onReset();
    }
  };

  const removeSelectedDataFromLocalStorage = (selectedItems: string[]) => {
    const savedDataString = localStorage.getItem('dataCollection');
    const savedData = savedDataString ? JSON.parse(savedDataString) : [];
    if (savedData) {
      const updatedData = [...savedData].filter((item) => {
        return !selectedItems.includes(item.key);
      });
      localStorage.setItem('dataCollection', JSON.stringify(updatedData));
      setSelectedItems([]);
      setDataSource(updatedData);
      setIsSelectAll(false);
    }
  };

  return (
    <section>
      <header>
        <h1>{t('header')}</h1>
        <Select
          value={currentLanguage}
          defaultValue={i18n.resolvedLanguage === 'th' ? 'th' : 'en'}
          onChange={handleLangChange}
          className='select-lang'
        >
          <Select.Option value='en' disabled={i18n.resolvedLanguage === 'en'}>
            {t('language.en')}
          </Select.Option>
          <Select.Option value='th' disabled={i18n.resolvedLanguage === 'th'}>
            {t('language.th')}
          </Select.Option>
        </Select>
      </header>
      <Form
        form={form}
        name='main-form'
        onValuesChange={(changedValues, allValues) => {
          if ('firstName' in changedValues || 'lastName' in changedValues) {
            const updatedFullName = `${allValues.firstName || ''} ${
              allValues.lastName || ''
            }`;
            dispatch(setFullName(updatedFullName));
          }
        }}
        onFinish={() => saveFormDataToLocalStorage(formData)}
      >
        <Row gutter={8}>
          <Col span={4}>
            <Form.Item
              name='prefix'
              label={t('input.prefix')}
              rules={[{ required: true, message: t('error') }]}
            >
              <Select
                placeholder={t('input.prefix')}
                value={formData.prefix}
                onChange={(value) => handleInputChange('prefix', value)}
              >
                <Select.Option value={t('options.prefix.mr')}>
                  {t('options.prefix.mr')}
                </Select.Option>
                <Select.Option value={t('options.prefix.mrs')}>
                  {t('options.prefix.mrs')}
                </Select.Option>
                <Select.Option value={t('options.prefix.ms')}>
                  {t('options.prefix.ms')}
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              name='firstName'
              label={t('input.firstName')}
              rules={[{ required: true, message: t('error') }]}
            >
              <Input
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              name='lastName'
              label={t('input.lastName')}
              rules={[{ required: true, message: t('error') }]}
            >
              <Input
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={6}>
            <Form.Item
              name='birthday'
              label={t('input.birthday')}
              rules={[{ required: true, message: t('error') }]}
            >
              <DatePicker
                format='MM/DD/YYYY'
                placeholder={t('placeholder.birthday')}
                value={formData.birthday}
                onChange={(_date, dateString) =>
                  handleInputChange('birthday', dateString)
                }
              />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              name='nationality'
              label={t('input.nationality')}
              rules={[{ required: true, message: t('error') }]}
            >
              <Select
                value={formData.nationality}
                onChange={(value) => handleInputChange('nationality', value)}
                placeholder={t('placeholder.nationality')}
              >
                {nationalitiesEn.map((item, index) => (
                  <Select.Option key={index} value={t(`nationalities.${item}`)}>
                    {t(`nationalities.${item}`)}
                  </Select.Option>
                ))}
                {/* {currentLanguage === "th"
                  ? nationalitiesTh.map((item, index) => (
                      <Select.Option key={index} value={item}>
                        {t(`nationalities.${item}`)}
                      </Select.Option>
                    ))
                  : nationalitiesEn.map((item, index) => (
                      <Select.Option key={index} value={item}>
                        {t(`nationalities.${item}`)}
                      </Select.Option>
                    ))} */}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name='idNumber' label={t('input.idNumber')}>
          <Row>
            {idParts.map((part, index, array) => {
              const getMaxLength = (index: number): number => {
                switch (index) {
                  case 0:
                    return 1;
                  case 1:
                    return 4;
                  case 2:
                    return 5;
                  case 3:
                    return 2;
                  case 4:
                    return 1;
                  default:
                    return 3;
                }
              };
              const maxLength = getMaxLength(index);
              return (
                <Col
                  className='id-input'
                  key={index}
                  span={
                    index === 0
                      ? 3
                      : index === 1
                      ? 5
                      : index === 2
                      ? 5
                      : index === 3
                      ? 4
                      : 3
                  }
                >
                  <Input
                    id={`input-${index}`}
                    value={part}
                    onChange={(e) =>
                      handleInputChangeId(
                        e.nativeEvent?.inputType,
                        e.target.value,
                        index,
                        maxLength,
                      )
                    }
                    maxLength={maxLength}
                  />
                  <span
                    className={`dash
                    ${index === array.length - 1 ? 'hidden' : ''}`}
                  >
                    -
                  </span>
                </Col>
              );
            })}
          </Row>
        </Form.Item>
        <Row>
          <Col>
            <Form.Item
              name='gender'
              label={t('input.gender')}
              rules={[{ required: true, message: t('error') }]}
            >
              <Radio.Group
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
              >
                <Radio value={t('options.gender.male')}>
                  {t('options.gender.male')}
                </Radio>
                <Radio value={t('options.gender.female')}>
                  {t('options.gender.female')}
                </Radio>
                <Radio value={t('options.gender.notSaying')}>
                  {t('options.gender.notSaying')}
                </Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name='tel'
          label={t('input.tel')}
          rules={[{ required: true, message: t('error') }]}
        >
          <Row>
            <Col span={4} className='id-input'>
              <Select
                value={telParts[0]}
                onChange={(value) => handleInputChangeTel(value, 0)}
              >
                {countryCodes.map((item, index) => {
                  return (
                    <Select.Option key={index} value={item}>
                      {item}
                    </Select.Option>
                  );
                })}
              </Select>
              <span className='dash'>-</span>
            </Col>
            <Col span={8}>
              <Input
                value={telParts[1]}
                onChange={(e) => handleInputChangeTel(e.target.value, 1)}
              />
            </Col>
          </Row>
        </Form.Item>
        <Row>
          <Col span={10}>
            <Form.Item name='passport' label={t('input.passport')}>
              <Input
                value={formData.passport}
                onChange={(e) => handleInputChange('passport', e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <Form.Item
              name='expectedSalary'
              label={t('input.expectedSalary')}
              rules={[{ required: true, message: t('error') }]}
            >
              <Input
                value={formData.expectedSalary}
                onChange={(e) =>
                  handleInputChange('expectedSalary', e.target.value)
                }
              />
            </Form.Item>
          </Col>
          <Col span={14}>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button htmlType='submit' className='send-button'>
                {t('action.submit')}
              </Button>
              <Button htmlType='button' onClick={onReset}>
                {t('action.clear')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className='table-container'>
        <div className='delete-container'>
          <Checkbox
            disabled={dataSource.length === 0}
            checked={isSelectAll}
            onChange={handleSelectAllItems}
          >
            {t('action.selectAll')}
          </Checkbox>
          <Button
            disabled={selectedItems.length === 0}
            onClick={() => removeSelectedDataFromLocalStorage(selectedItems)}
          >
            {t('action.deleteSelection')}
          </Button>
        </div>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </div>
      {modalIsOpen && (
        <EditForm
          itemToEdit={itemToEdit as FormData}
          setDataSource={setDataSource}
          setModalIsOpen={setModalIsOpen}
          t={t as TFunction}
        />
      )}
    </section>
  );
}
export default App;
