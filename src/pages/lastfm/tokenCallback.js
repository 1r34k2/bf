import React from 'react'
import styles from '@/styles/Home.module.css'
import { useRouter } from "next/router";
import md5 from 'md5';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
export async function getServerSideProps(context){
    const token = context.query.token
    const api_key = '97bcf44c84e782f84ab4904e788a45a8'
    const method = 'auth.getSession'
    const secret = '632a627c6362bf165e2b61fa5211c060'
    const api_sig = md5('api_key'+api_key+'method'+method+'token'+token+secret)
    const parser = new XMLParser()
    const res = await axios.get("http://ws.audioscrobbler.com/2.0",{
        params: {
            method:method,
            api_key:api_key,
            token:token,
            api_sig:api_sig
        }        
    
    }
    ).catch()
    if(res.data != undefined){
        await axios.post("https://ire4ka.online/api/lastfm",{
            authToken: context.req.cookies['authToken'],
            key: parser.parse(res.data).lfm.session.key
        }).then(function(resp){
        })
    }
    const resp = await axios.post("https://ire4ka.online/api/searchToken",{
            authToken: context.req.cookies['authToken']
        })
    return{
        redirect: {
            destination: '/personal/' + resp.data.username,
            permanent: false
        }
    }
}
export default function TokenCallback(props){    

}