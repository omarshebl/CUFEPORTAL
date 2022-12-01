import Header from './Components/Header'
import Main from './Components/Main'
import Footer from './Components/Footer'
import * as cookieHelper from './cookie'

// TODO remove login when cookie is found
export default function App() {
    cookieHelper.setCookie('ASPX.auth', 'Mynam')
    return (
        <div>
        <Header />
        <Main />
        <Footer />
        </div>
    )
}