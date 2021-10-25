import React, {useState, useMemo, useCallback} from "react";
import css from './index.module.css';
import TopBar from "../TopBar";
import PageAnnotate from "../PageHandler";
import PageAndBarContext from "../../shared/pageContext";
import {initScrollListener} from "../../shared/scrollListen";

export default function PdfAnnotate({pdf}) {
    const [wrapWidth,setWidth]=useState(0);
    const [pageScale,setScale]=useState(0);
    const measuredRef=useCallback(node => {
        if (node !== null) {
            initScrollListener(node);
            setWidth(node.getBoundingClientRect().width);
        }
    }, []);

    const providerValue=useMemo(()=>{
        return {
            pageScale,
            setScale,
            pdfUrl: pdf,
            wrapWidth
        }
    },[setScale,pageScale,pdf,wrapWidth]);

    return <div className={css.wrap} ref={measuredRef}>
        <PageAndBarContext.Provider value={providerValue}>
            {wrapWidth ? <PageAnnotate /> : null}
            <TopBar />
        </PageAndBarContext.Provider>
    </div>
}