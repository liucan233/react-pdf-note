import css from './index.module.css';
import {useContext} from 'react';
import PageAndBarContext from "../../shared/pageContext";

export default function TopBar(){
    const {setScale,pageScale}=useContext(PageAndBarContext);

    const handleEnlarge=()=>{
        setScale(pageScale>=0? pageScale+0.2 : 0.2);
    };
    const handleReduce=()=>{
        setScale(pageScale<=0? pageScale-0.2 : -0.2);
    };
    return <div className={css.warp}>
        <span className={css.itemWrap} onClick={handleEnlarge}>
            <svg className={css.item} viewBox="0 0 1024 1024">
                <path d="M926.72 829.44q28.672 32.768 31.232 57.344t-18.944 48.128q-24.576 27.648-54.272 26.112t-57.344-24.064l-164.864-158.72q-46.08 30.72-99.84 47.616t-113.152 16.896q-80.896 0-151.552-30.72t-123.392-83.456-82.944-123.392-30.208-151.552q0-79.872 30.208-150.528t82.944-123.392 123.392-83.456 151.552-30.72 151.552 30.72 123.392 83.456 83.456 123.392 30.72 150.528q0 61.44-17.92 116.736t-49.664 101.376q13.312 14.336 37.376 38.4t48.128 48.64 44.544 44.032zM449.536 705.536q53.248 0 100.352-19.968t81.92-54.784 54.784-81.92 19.968-100.352-19.968-100.352-54.784-81.92-81.92-54.784-100.352-19.968-99.84 19.968-81.408 54.784-55.296 81.92-20.48 100.352 20.48 100.352 55.296 81.92 81.408 54.784 99.84 19.968zM512 384l128 0 0 128-128 0 0 128-129.024 0 0-128-126.976 0 0-128 126.976 0 0-128 129.024 0 0 128z"/>
            </svg>
        </span>
        <span className={css.itemWrap} onClick={handleReduce}>
            <svg className={css.item} viewBox="0 0 1024 1024">
                <path d="M927.744 829.44q28.672 32.768 31.232 57.344t-18.944 48.128q-24.576 27.648-54.272 26.112t-57.344-24.064l-164.864-157.696q-46.08 29.696-99.84 46.592t-113.152 16.896q-80.896 0-151.552-30.72t-123.392-83.456-82.944-123.392-30.208-151.552q0-79.872 30.208-150.528t82.944-123.392 123.392-83.456 151.552-30.72 151.552 30.72 123.392 83.456 83.456 123.392 30.72 150.528q0 61.44-17.92 116.736t-49.664 102.4l36.864 37.888q24.576 23.552 48.64 48.128t43.52 44.032zM450.56 705.536q53.248 0 100.352-19.968t81.92-54.784 54.784-81.92 19.968-100.352-19.968-100.352-54.784-81.92-81.92-54.784-100.352-19.968-99.84 19.968-81.408 54.784-55.296 81.92-20.48 100.352 20.48 100.352 55.296 81.92 81.408 54.784 99.84 19.968zM256 384l385.024 0 0 128-385.024 0 0-128z"/>
            </svg>
        </span>
    </div>
}