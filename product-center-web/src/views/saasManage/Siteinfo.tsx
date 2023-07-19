import { Button, Card, Form, Input, message, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import '@/styles/saasManage.scss';
import UploadComponent from '@/components/UploadComponent';
import { validaHttps } from '@/utils/commonUtils';
import { enterpriseInfo, setWebsiteInfo } from '@/api/saasManage';
import { cloneDeep } from 'lodash';
import { AuthVisible } from '@/utils/url';

//网站信息
const Appcenter: React.FC = () => {
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    let paramas = cloneDeep(values);
    paramas.browserIco = values.browserIco[0];
    paramas.logo = values.logo[0];
    paramas.lightColourLogo = values.logo[1];
    paramas.bottomLogo = values.bottomLogo[0];
    paramas.communityQrCode = values.communityQrCode[0];
    paramas.gzhQrCode = values.gzhQrCode[0];
    paramas.enterpriseWechatCode = values.enterpriseWechatCode[0];
    setWebsiteInfo(paramas).then((res) => {
      message.success('保存成功！');
    });
  };
  useEffect(() => {
    enterpriseInfo('enterpriseId=' + (localStorage.enterpriseId ? localStorage.enterpriseId : 29)).then((res) => {
      let webInfo = res.data;
      webInfo.browserIco = webInfo.browserIco && [webInfo.browserIco];
      if (webInfo.logo) {
        webInfo.logo = [webInfo.logo];
      }
      if (webInfo.logo && webInfo.lightColourLogo) {
        webInfo.logo.push(webInfo.lightColourLogo);
      }
      webInfo.bottomLogo = webInfo.bottomLogo && [webInfo.bottomLogo];
      webInfo.communityQrCode = webInfo.communityQrCode && [webInfo.communityQrCode];
      webInfo.gzhQrCode = webInfo.gzhQrCode && [webInfo.gzhQrCode];
      webInfo.enterpriseWechatCode = webInfo.enterpriseWechatCode && [webInfo.enterpriseWechatCode];
      form.setFieldsValue(webInfo);
    });
  }, []);
  return (
    <Card>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="网站信息" key="1">
          <Form
            form={form}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
            className="sm-website-form"
          >
            <Form.Item label="产品名称" name="productName">
              <Input showCount maxLength={20} placeholder="如：跨税云，在需要显示网站名称的位置显示" allowClear />
            </Form.Item>
            <Form.Item label="公司名称" name="companyName">
              <Input placeholder="如：跨税云（深圳）科技有限公司" allowClear />
            </Form.Item>
            <Form.Item label="公司详细地址" name="companyAddress">
              <Input.TextArea placeholder="请输入" allowClear />
            </Form.Item>
            <Form.Item label="邮箱地址" name="email">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
            <Form.Item label="服务热线" name="serviceHotline">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
            <Form.Item
              label="隐私政策链接"
              name="privacyPolicyLink"
              rules={[{ validator: (rule, value, callback) => validaHttps(rule, value, callback) }]}
            >
              <Input placeholder="请输入链接" allowClear />
            </Form.Item>
            <Form.Item
              label="服务协议链接"
              name="serviceAgreementLink"
              rules={[{ validator: (rule, value, callback) => validaHttps(rule, value, callback) }]}
            >
              <Input placeholder="请输入" allowClear />
            </Form.Item>
            <Form.Item label="版权信息" name="copyrightInfo">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
            <Form.Item label="ICP备案号" name="icpRecordNo">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
            <Form.Item
              label="备案号链接"
              name="recordLink"
              extra="域名备案信息链接。http:beian.milt.gov.cn/"
              rules={[{ validator: (rule, value, callback) => validaHttps(rule, value, callback) }]}
            >
              <Input placeholder="请输入链接" showCount maxLength={100} allowClear />
            </Form.Item>
            <Form.Item label="联系电话" name="telephoneNumber">
              <Input.TextArea
                autoSize={{ minRows: 4, maxRows: 8 }}
                placeholder="请输入办事处名称和联系号码，使用回车键换行"
                allowClear
              />
            </Form.Item>
            <Form.Item label="办公地址" name="officeAddress">
              <Input.TextArea
                autoSize={{ minRows: 4, maxRows: 8 }}
                placeholder="请输入办事处名称和详细地址，使用回车键换行"
                allowClear
              />
            </Form.Item>
            <Form.Item
              label="浏览器图标"
              name="browserIco"
              extra="建议尺寸:32*32像素，支持ico格式，该图片将出现在浏览器里显示"
            >
              <UploadComponent btnTxt="上传图片" length={1} />
            </Form.Item>
            <Form.Item
              label="网站顶部Logo"
              name="logo"
              extra="建议尺寸：240*60像素，支持jpg、jpeg、png，该图将出现在网站左上角显示"
            >
              <UploadComponent btnTxt="上传图片" length={2} />
            </Form.Item>
            <Form.Item
              label="网站底部Logo"
              name="bottomLogo"
              extra="建议尺寸：240*60像素，支持jpg、jpeg、png，该图将出现在网站左上角显示"
            >
              <UploadComponent btnTxt="上传图片" length={1} />
            </Form.Item>
            <Form.Item label="社群二维码" name="communityQrCode" extra="建议尺寸：100*100像素，支持jpg、jpeg、png">
              <UploadComponent btnTxt="上传图片" length={1} />
            </Form.Item>
            <Form.Item label="公众号二维码" name="gzhQrCode" extra="建议尺寸：100*100像素，支持jpg、jpeg、png">
              <UploadComponent btnTxt="上传图片" length={1} />
            </Form.Item>
            <Form.Item
              label="企业微信二维码"
              name="enterpriseWechatCode"
              extra="建议尺寸：建议尺寸：100*100像素，支持jpg、jpeg、png，该二维码将在网站底部显示"
            >
              <UploadComponent btnTxt="上传图片" length={1} />
            </Form.Item>
            <Form.Item>
              {AuthVisible('SI_01') && (
                <Button type="primary" htmlType="submit" className="sm-website-btn">
                  保存
                </Button>
              )}
            </Form.Item>
          </Form>
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

export default Appcenter;
