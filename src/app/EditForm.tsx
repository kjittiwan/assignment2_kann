import { useEffect, useState, useCallback } from 'react';
import * as dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Input, Radio, Select, DatePicker, Row, Col } from 'antd';
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
} from '../redux/editSlice';
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

type EditFormProps = {
  itemToEdit: FormData;
  setDataSource: (data: FormData[]) => void;
  setModalIsOpen: (isOpen: boolean) => void;
  t: TFunction;
};
function EditForm({
  itemToEdit,
  setDataSource,
  setModalIsOpen,
  t,
}: EditFormProps): JSX.Element {
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.editData);
  const formatId = (id: string) => {
    const result: string[] = [];
    if (id.length === 13) {
      result.push(id.charAt(0));
      result.push(id.substring(1, 5));
      result.push(id.substring(5, 10));
      result.push(id.substring(10, 12));
      result.push(id.charAt(12));
    } else {
      console.error('must have exactly 13 characters');
    }
    return result;
  };

  const splitTel = (tel: string) => {
    return tel.split(' ');
  };

  const [form] = Form.useForm();
  const [idParts, setIdParts] = useState<string[]>(
    itemToEdit.idNumber === ''
      ? ['', '', '', '', '']
      : formatId(itemToEdit.idNumber),
  );
  const [telParts, setTelParts] = useState<string[]>(splitTel(itemToEdit.tel));

  const initialValues = {
    birthday: dayjs(itemToEdit.birthday, 'MM/DD/YYYY'),
    expectedSalary: itemToEdit.expectedSalary,
    firstName: itemToEdit.firstName,
    gender: itemToEdit.gender,
    idNumber: idParts,
    lastName: itemToEdit.lastName,
    nationality: itemToEdit.nationality,
    passport: itemToEdit.passport,
    prefix: itemToEdit.prefix,
    tel: telParts,
  };

  const setInitialStates = () => {
    dispatch(setExpectedSalary(itemToEdit.expectedSalary));
    dispatch(setFirstName(itemToEdit.firstName));
    dispatch(setFullName(itemToEdit.fullName));
    dispatch(setGender(itemToEdit.gender));
    if (itemToEdit.idNumber !== '') {
      dispatch(setIdNumber(itemToEdit.idNumber));
    } else {
      dispatch(setIdNumber(''));
    }
    dispatch(setLastName(itemToEdit.lastName));
    dispatch(setNationality(itemToEdit.nationality));
    dispatch(setPassport(itemToEdit.passport));
    dispatch(setPrefix(itemToEdit.prefix));
    dispatch(setTel(itemToEdit.tel));
    dispatch(setBirthday(itemToEdit.birthday));
  };

  useEffect(() => {
    setInitialStates();
  }, []);

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
        document.getElementById(`input-${prevIndex}-edit`)?.focus();
      }
    } else {
      const numericValue = value.replace(/\D/g, '');
      if (index < 4 && numericValue.length === maxLength) {
        const nextIndex = index + 1;
        if (nextIndex < idParts.length) {
          document.getElementById(`input-${nextIndex}-edit`)?.focus();
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

  const updateData = (formData: FormData) => {
    const savedDataString = localStorage.getItem('dataCollection');
    const savedData: FormData[] = savedDataString
      ? JSON.parse(savedDataString)
      : [];
    if (savedData) {
      const updatedData = [...savedData].map((item) => {
        if (item.key === itemToEdit.key) {
          return { ...formData, key: item.key };
        } else {
          return item;
        }
      });
      localStorage.setItem('dataCollection', JSON.stringify(updatedData));
      setDataSource(updatedData);
      setModalIsOpen(false);
    }
  };

  return (
    <div className='modal'>
      <Form
        form={form}
        name='edit-form'
        className='edit-form'
        initialValues={initialValues}
        onValuesChange={(changedValues, allValues) => {
          if ('firstName' in changedValues || 'lastName' in changedValues) {
            const updatedFullName = `${allValues.firstName || ''} ${
              allValues.lastName || ''
            }`;
            dispatch(setFullName(updatedFullName));
          }
        }}
        onFinish={() => updateData(formData)}
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
                {/* {currentLanguage === 'th'
                  ? nationalitiesTh.map((item, index) => (
                      <Select.Option key={index} value={item}>
                        {t(`nationalities.${item}`)}
                      </Select.Option>
                    ))
                  : nationalitiesEn.map((item, index) => (
                      <Select.Option key={index} value={item}>
                        {t(`nationalities.${item}`)}
                      </Select.Option>
                    ))
                } */}
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
                  key={index}
                  className='id-input'
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
                    id={`input-${index}-edit`}
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
                    className={`dash ${
                      index === array.length - 1 ? 'hidden' : ''
                    }`}
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
                {t('action.confirmEdit')}
              </Button>
              <Button htmlType='button' onClick={() => setModalIsOpen(false)}>
                {t('action.cancel')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default EditForm;
