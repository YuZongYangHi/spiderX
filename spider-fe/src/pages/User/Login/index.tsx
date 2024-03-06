import "./index.css"
import Footer from '@/components/Footer';
import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormText,
} from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { FormattedMessage, useIntl, Helmet } from '@umijs/max';
import SelectLang from '@/components/SelectLang'
import {Alert, Flex, message, Space} from 'antd';
import React, {useEffect, useState} from 'react';
import {UserLogin} from "@/services/users/api";
import {deleteCookie, saveCookie} from "@/util/cookie";

const Lang = () => {
  const langClassName = useEmotionCss(({ token }) => {
    return {
      lineHeight: '42px',
      position: 'absolute',
      top: -1.5,
      left: "98%",
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    };
  });

  return (
    <div className={langClassName} data-lang>
      {SelectLang && <SelectLang />}
    </div>
  );
};

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  useEffect(()=>{
    deleteCookie("spider_user_login_session")
  }, [])

  const [userLoginState, setUserLoginState] = useState({});

  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('/img/spiderx-bk.png')",
      backgroundSize: '100% 100%',
    };
  });

  const intl = useIntl();
  const handleSubmit = async (values: UserRequest.UserLogin) => {
    try {
      // 登录
      const result = await UserLogin(values);
      if (result.success) {
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });
        saveCookie("spider_user_login_session", result.data.list.value, result.data.list.expireTime)
        message.success(defaultLoginSuccessMessage);
        const urlParams = new URL(window.location.href).searchParams;
        const urlPath = urlParams.get('redirect') || "/"
        window.location.href = `${window.location.origin}${urlPath}`
        return;
      }
      // 如果失败去设置用户错误信息
      setUserLoginState(result.errorMessage);
    } catch (error) {
      if (error.response.status === 403) {
        message.error(intl.formatMessage({
          id: 'pages.login.deny'
        }))
        return
      }
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };
  const { status } = userLoginState;

  return (
    <div className={containerClassName}>
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'menu.login',
            defaultMessage: '登录页',
          })}
          - SpiderX
        </title>
      </Helmet>


      <div style={{
        background: "#fff",
        width: "100%",
        height: 42,
        boxShadow: '0 2px 6px 0 rgba(0,0,0,.1)',
        zIndex: 100,
        borderRadius: 8,
      }}>
        <div className="space-align-container-login">
            <Space align="center">
              <span><img style={{height: 28}} src={"/img/spider-logo.jpg"}/></span>
            </Space>
        </div>
        <Lang />
      </div>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
          width: 400,
          background: '#fff',
          boxShadow: '0 2px 6px 0 rgba(0,0,0,.1)',
          zIndex: 100,
          borderRadius: 8,
          position: 'absolute',
          left: "100%",
          top: "21%",
          marginLeft: -500
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<Flex justify="center" align="center"><img alt="logo" src={intl.formatMessage({id: 'page.user.login.form.logo'})} /></Flex>}
          title={false}
          subTitle={false}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as UserRequest.UserLogin);
          }}
        >
          {status === 'error' && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
                defaultMessage: '账户或密码错误(admin/ant.design)',
              })}
            />
          )}

            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.username.placeholder',
                  defaultMessage: '用户名: admin or user',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.username.required"
                        defaultMessage="请输入用户名!"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: '密码: ant.design',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                ]}
              />
            </>
        </LoginForm>
      </div>
      <div style={{
        position: 'absolute',
        width: "100%",
        textAlign: "center",
        top: '90%'

      }}>
      <Footer />
      </div>
    </div>
  );
};

export default Login;
