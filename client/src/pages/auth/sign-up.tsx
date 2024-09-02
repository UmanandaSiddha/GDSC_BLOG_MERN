import AuthForm from '@/components/custom/auth-form';
import { Helmet } from 'react-helmet-async';

const SignUp = () => {

    return (
        <>
            <Helmet>
                <title>GDSC BLOG | Sign Up</title>
                <meta name="description" content="This is the sign up page of Google Developers Students Club" />
                <meta name="keywords" content="register, sign-up, react, blog, gdsc, google, tezpur" />
            </Helmet>
            
            <AuthForm type="sign-up" />
        </>
    )
}

export default SignUp;