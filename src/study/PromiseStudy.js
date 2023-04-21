import React, { useState } from 'react';

const PromiseStudy = () => {

    const a = new Promise((resolve, reject) => {
        console.log("프로미스 생성")
        if(1 === 1) {
            resolve();
        } else {
            reject(new Error("1번 오류입니다."));
        }
    });
    
    const clickHandler = () => {
        a
        .then(() => {
            console.log("1번 then 호출")
            return new Promise((resolve, reject) => {
                if(1 !== 1) {
                    resolve("리턴!!!");
                } else {
                    reject(new Error("2번 오류입니다."));
                }
            })
        })
        .catch((error) => {
            console.log(error);
        })
        .then(b)
        .catch((error) => {
            console.log(error);
        });
    }
    
    const b = (str) => {
        console.log(str);
    }

    return (
        <div>
            <button onClick={clickHandler}>버튼</button>
        </div>
    );
};

export default PromiseStudy;