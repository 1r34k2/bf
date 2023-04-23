import React, {useState} from 'react'
import styles from '@/styles/Home.module.css'
import {useRouter} from 'next/router'
import {getCookie, setCookie} from 'cookies-next'
import axios from 'axios'
import TinderCard from 'react-tinder-card'

const signIn = async (username) => {
  console.log("HI")
  location.href = 'https://www.last.fm/api/auth/?api_key=97bcf44c84e782f84ab4904e788a45a8&cb=https://ire4ka.online/lastfm/tokenCallback'
}

export async function getServerSideProps(context){
  const authToken = context.req.cookies['authToken']
  const username = context.req.cookies['username']
  if(authToken == undefined){
    return{
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }
  else{
    const res = await axios.post('https://ire4ka.online/api/searchToken', {
      authToken
    }).catch(function(error){
      console.log(error)
    })
    if(res.data != null){
      return {
        props: {
          username: res.data.username,
          verified: res.data.verified,
          keyLast: res.data.key
        }
      }
    }
  }
}

const onSwipe = (direction) => {
  console.log('You swiped: ' + direction)
}

const onCardLeftScreen = (myIdentifier) => {
  console.log(myIdentifier + ' left the screen')
}

const redir = async (username) => {
  location.href = '/personal/' + username
}
const logout = function () {
  const authToken = getCookie('authToken')
  if(authToken != undefined){
    const res = axios.post('https://ire4ka.online/api/removeToken', {
      authToken
    }).catch(function(error){
      console.log(error)
    })
  }
  setCookie('authToken', null, {
        maxAge: 0,
        path: '/'
    })
    setCookie('username', null, {
      maxAge: 0,
      path: '/'
  })
  location.href = '/'

  }

export default function Component(props) {
  const router = useRouter()
  const { username } = router.query 
  if(username == props.username){
    if(props.verified == true){
      if(props.keyLast != " "){
        return (
          <>
          <main className={styles.main}>
              <TinderCard onSwipe={onSwipe} onCardLeftScreen={() => onCardLeftScreen('fooBar')} preventSwipe={['right', 'left']}>Hello, World!</TinderCard>
          </main>
          </>
        )
      }
      else{
        return (
          <>
          <main className={styles.main}>
              <div className={styles.wrapper}>
                <div className={styles.login_container}>
                    <div className={styles.login}>
                          <h1>To proceed</h1>
                          <button className={styles.big_btn} onClick={function(){signIn(username)}}>Log in with Last.fm</button>
                          <p className={styles.login_desc}>Please login to get access to  spotify content.</p>
                          <p className={styles.login_desc_small}>You will automatically be redirected to this page after login.</p>
                          <h1>Or you can</h1>
                          <button className={styles.big_btn} onClick={logout}>Log out</button>
                          <p className={styles.login_desc}>You can proceed later.</p>
                      </div>
                  </div>
            </div>
          </main>
          </>
        )
      }
      
    }
    else{
      return (
        <>
        <main className={styles.main}>
            <div className={styles.wrapper}>
              <div className={styles.login_container}>
                  <div className={styles.login}>
                        <h1>Verify your account.</h1>
                        <p className={styles.login_desc}>Please, check your email.</p>
                        <button className={styles.big_btn} onClick={logout}>Log out</button>
                        <p className={styles.login_desc}>You can proceed later.</p>
                    </div>
                </div>
          </div>
        </main>
        </>
      )
    }
    
  }
  else{
    return (
      <>
      <main className={styles.main}>
          <div className={styles.wrapper}>
            <div className={styles.login_container}>
                <div className={styles.login}>
                      <h1>Sorry, you can&apos;t access that page</h1>
                      <button className={styles.big_btn} onClick={function(){redir(username)}}>Get back to my page</button>
                  </div>
              </div>
        </div>
      </main>
      </>
    )
  }
}
