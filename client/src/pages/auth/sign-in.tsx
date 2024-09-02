import AuthForm from '@/components/custom/auth-form';
import { Helmet } from 'react-helmet-async';

const SignIn = () => {
    return (
        <>
            <Helmet>
                <title>GDSC BLOG | Sign In</title>
                <meta name="description" content="This is the sign in page of Google Developers Students Club" />
                <meta name="keywords" content="login, sign-in, react, blog, gdsc, google, tezpur" />
            </Helmet>

            <AuthForm type='sign-in' />
        </>
    )
}

export default SignIn;