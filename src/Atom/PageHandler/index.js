import css from './index.module.css';
import {useEffect, useMemo, useState, useContext, useCallback, useRef,useLayoutEffect} from 'react';
import {getPdfDoc, getViewport} from "../../shared/pdf2png";
import PdfPage from "../PdfPage";
import PageAndBarContext from "../../shared/pageContext";
import TaskProgress from "../TaskProgress";
import pageContext from "../../shared/pageContext";
import scrollAnchor from "../../shared/scrollAnchor";
import scaleCheck from "../../shared/scaleCheck";

export default function PageAnnotate(){
    // 用于保存一些状态
    const stateRef=useRef({
        completeFlag: false,
        wrapRef: null,
        lastDocSize: null,
        completedUpdate: false
    });

    stateRef.current.completedUpdate=true;

    // 将本组件的div存放在stateRef
    const handleRef=node=>{
        if(!stateRef.current.wrapRef) {
            stateRef.current.wrapRef = node;
            node.addEventListener('wheel',e=>{
                if(e.ctrlKey){
                    e.preventDefault();
                    e.stopPropagation();
                    if(stateRef.current.completedUpdate&&scaleCheck(docWidth.userScale-e.deltaY)){
                        docWidth.userScale-=e.deltaY;
                        stateRef.current.completedUpdate=false
                        setDocWidth({...docWidth});
                    }
                }
            },{passive: false});
        }
    }

    // 在pdf文档链接变化时加载pdfDocTask
    const {pdfUrl}=useContext(PageAndBarContext);
    const pdfDocLoadingTask=useMemo(()=>{
        stateRef.current.completeFlag=false;
        return getPdfDoc(pdfUrl);
    },[pdfUrl]);

    // 储存每个链接对应的pdf文档代理
    const [pdfDocProxy,setProxy]=useState(null);

    // 更新pdfDocProxy指定值，并销毁之前实例
    const handleNewProxy=useCallback(proxy=>{
        if(pdfDocProxy){
            pdfDocProxy.destroy();
            pdfDocProxy.cleanup();
        }
        setProxy(proxy);
        // eslint-disable-next-line
    },[]);

    // 在pdfDocLoadingTask更新后及时创建pdfDocProxy对象
    useEffect(function () {
        pdfDocLoadingTask.promise.then(handleNewProxy);
        // eslint-disable-next-line
    },[pdfDocLoadingTask]);

    // 储存pdfDocProxy对应的viewport，将每个页面视为一样大
    const [viewport,setViewport]=useState(null);

    const handleNewView=useCallback((proxy,width)=>{
        getViewport(proxy,width ).then(view=>{
            stateRef.current.completeFlag=true;
            setViewport(view);
        });
    },[]);

    // 初次加载完pdf和用户缩放时渲染计算viewpoint
    const {docWidth,setDocWidth}=useContext(pageContext);
    useEffect(function () {
        if(pdfDocProxy && docWidth.userScale){
            clearTimeout(stateRef.current.viewTask);
            stateRef.current.viewTask=setTimeout(
                handleNewView.bind(null,pdfDocProxy,docWidth.userScale),
                300
            );
        }
        // eslint-disable-next-line
    },[pdfDocProxy,docWidth]);

    // useEffect(function () {
    //     if(stateRef.current.wrapRef){
    //         stateRef.current.wrapRef.addEventListener('wheel',e=>{
    //             if(e.ctrlKey){
    //                 e.preventDefault();
    //                 e.stopPropagation();
    //                 docWidth.userScale-=e.deltaY;
    //                 setDocWidth({...docWidth});
    //             }
    //         },{passive: false});
    //     }
    // },[stateRef.current.wrapRef])

    const {completeFlag}=stateRef.current;

    const docSize=useMemo(()=>{
        if(viewport) return {
            width: Math.floor(docWidth.userScale / devicePixelRatio),
            height: Math.floor(viewport.height * docWidth.userScale / viewport.width / devicePixelRatio)
        }
        return null;
        // eslint-disable-next-line
    },[docWidth,completeFlag]);

    useLayoutEffect(function () {
        if(stateRef.current.lastDocSize){
            scrollAnchor(stateRef.current.wrapRef,stateRef.current.lastDocSize,docSize)
        }
        stateRef.current.lastDocSize=docSize;
    },[docSize]);

    if(!completeFlag) return <div className={css.warp}>
        <TaskProgress loadingTask={pdfDocLoadingTask} />
    </div>

    return <div
        className={css.warp}
        ref={handleRef}

    >
        {Array.from(new Array(pdfDocProxy.numPages), (item, index) => {
            const pageNum = index + 1;
            return <PdfPage
                key={`${pageNum}${pdfUrl}`}
                pdfDocProxy={pdfDocProxy}
                viewport={viewport}
                pageNum={pageNum}
                docSize={docSize}
            />
        })}
    </div>
}