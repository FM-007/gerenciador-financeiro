import '../common/template/dependencies.js'
import React from "react"
import Header from '../common/template/Header.jsx'
import Sidebar from '../common/template/Sidebar.jsx'
import Footer from '../common/template/Footer.jsx'
import Routes from './router.js'
import Messages from '../common/msg/Messages'

export default props => {

    return (

        <div className="wrapper">

            <Header />
            <Sidebar />

            <div className="content-wrapper">
                <Routes />
            </div>

            <Footer />

            <Messages />

        </div>

    )

}