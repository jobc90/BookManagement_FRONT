/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import axios from 'axios';
import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import RentalList from '../../components/UI/BookDetail/RentalList/RentalList';

const mainContainer = css`
    padding: 10px;
    background-color: white;
`;

const bookCardContainer = css`
    position: absolute;
    left: 130px;
    top: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 500px;
    height: 700px;
    border: 3px solid #dbdbdb;
    border-radius: 7px;
    padding: 20px;
`;

const headerContainer = css`
    display: flex;
    flex-direction: column;

    width: 350px;

`;

const headerTitle = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    font-size: 35px;
    font-weight: 600;
`;

const headerRecomendation = css`
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font-size: 15px;
    font-weight: 600;
`;

const headerContent = css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;

`;

const headertext = css`
    padding: 5px;
    font-size: 12px;
    font-weight: 600;
`;

const bookContainer = css`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const bookImg = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 2px solid #dbdbdb;
    border-radius: 7px;
    width: 261px;
    margin-bottom: 10px;
`;


const BookDetail = () => {
    const { bookId } = useParams();
    const queryClient = useQueryClient();

    const getBook = useQuery(["getBook"], async () => {
        const option = {
            headers: {
                Authorization: localStorage.getItem("accessToken")
            }
        }
        const response = await axios.get(`http://localhost:8080/book/${bookId}`, option);
        return response;
    });

    const getLikeCount = useQuery(["getLikeCount"], async () => {
        const option = {
            headers: {
                Authorization: localStorage.getItem("accessToken")
            }
        }
        const response = await axios.get(`http://localhost:8080/book/${bookId}/like`, option);
        return response;
    });
    
    const getLikeStatus = useQuery(["getLikeStatus"], async () => {
        const option = {
            params: {
                userId: queryClient.getQueryData("principal").data.userId
            },
            headers: {
                Authorization: localStorage.getItem("accessToken")
            }
        }
        const response = await axios.get(`http://localhost:8080/book/${bookId}/like/status`, option);
        return response;
    });

    const setLike = useMutation(async () => {
        const option = {
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("accessToken")
            }
        }
        return await axios.post(`http://localhost:8080/book/${bookId}/like`, JSON.stringify({
            userId: queryClient.getQueryData("principal").data.userId
        }), option);
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries("getLikeCount");
            queryClient.invalidateQueries("getLikeStatus");
        }
    });

    const disLike = useMutation(async () => {
        const option = {
            params: {
                userId: queryClient.getQueryData("principal").data.userId
            },
            headers: {
                Authorization: localStorage.getItem("accessToken")
            }
        }
        return await axios.delete(`http://localhost:8080/book/${bookId}/like`, option);
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries("getLikeCount");
            queryClient.invalidateQueries("getLikeStatus");
        }
        
    });

    if(getBook.isLoading) {
        return <div>불러오는 중...</div>
    }

    if(!getBook.isLoading)
    return (
        <div css={mainContainer}>
            <Sidebar />
            <div css={bookCardContainer}>
                <header css={headerContainer}>
                    <h1 css={headerTitle}>{getBook.data.data.bookName} <p css={headerRecomendation}>추천: {getLikeCount.isLoading ? "Looking up..." : getLikeCount.data.data}</p> </h1>
                    <div css={headerContent}>
                        <p css={headertext}>분류: {getBook.data.data.categoryName}</p>
                        <p css={headertext}>저자명: {getBook.data.data.authorName}</p>
                        <p css={headertext}>출판사: {getBook.data.data.publisherName}</p>
                        
                    </div>
                </header>
                <main css={bookContainer}>
                    <div>
                        <img css={bookImg} src={getBook.data.data.coverImgUrl} alt={getBook.data.data.categoryName} />
                    </div>
                    <div>
                        <RentalList bookId={bookId}/>
                    </div>
                    <div>
                        {getLikeStatus.isLoading 
                            ? "" 
                            : getLikeStatus.data.data === 0 
                                ? (<button onClick={() => {setLike.mutate()}}>추천하기</button>)
                                : (<button onClick={() => {disLike.mutate()}}>추천취소</button>)}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default BookDetail;