import {Component} from "react";
import css from './index.module.css'

export default class ScrollOptimize extends Component{
    state={
        children: null
    }

    _serve=null

    _wrapRef= {
        current: null
    }

    _preWrapState=null

    _childrenShow= null

    _asyncReRenderId=0

    creatChildrenComponents(){
        const {children}=this.state;
        const {nodeCount,nodeSize}=this.props;
        const ChildrenComponent=this.props.children;
        return Array.from(new Array(nodeCount),(_,index)=>{
            const show=children? children[index] : false;
            return <div
                className={css.child}
                key={index}
                style={nodeSize}
                data-page={index}
            >
                {show?
                    <ChildrenComponent
                        style={nodeSize}
                        index={index}
                        {...this.props.params}
                    />
                    :
                    null
                }
            </div>
        });
    }

    async handleObserverCallback(changList){
        if(this._asyncReRenderId) clearTimeout(this._asyncReRenderId);
        const {_childrenShow}=this;
        if(!_childrenShow){
            throw Error('_childrenShow不能为空');
        } else {
            changList.forEach(item=>{
                const {intersectionRatio,target}=item,
                    {page}=target.dataset;
                _childrenShow[page] = intersectionRatio > 0;
            });
            this._asyncReRenderId=setTimeout(()=>{
                this.setState({
                    children: [..._childrenShow]
                })
            },200);
        }
    }

    // handleWheelZoom(event){
    //     if(event.ctrlKey){
    //         event.stopPropagation();
    //         event.preventDefault();
    //     }
    // }


    completeScrollDiv(preSize,curSize,preWrapSize,scaleCtr){
        if(this._wrapRef.current){
            const preTop=preWrapSize.top,
                preLeft=preWrapSize.left
            const curPage = Math.floor(preTop / preSize.height);
            const offsetCompensation = (1-curSize.height/preSize.height)*curPage*20;
            return {
                top: preTop * curSize.height / preSize.height + offsetCompensation,
                left: preLeft+(curSize.width-preSize.width)/2
            }
        } else {
            throw new TypeError('无法获取上次滚动数据');
        }
    }

    componentDidMount() {
        this._childrenShow=Array.from(new Array(this.props.nodeCount),()=>false);

        this._serve=new IntersectionObserver(
            this.handleObserverCallback.bind(this),
            {
                root: this._wrapRef.current,
                threshold: [0, 0.05]
            }
        );

        if(this._wrapRef.current?.children?.length>0){
            Array.prototype.forEach.call(this._wrapRef.current.children,child=>{
                if(child.__proto__===HTMLDivElement.prototype){
                    this._serve.observe(child);
                } else {
                    throw new TypeError('孩子节点不为HTMLDivElement类型');
                }
            });
        } else {
            throw new TypeError('读取孩子节点发生错误');
        }

        // this._wrapRef.current.addEventListener('wheel',this.handleWheelZoom.bind(this),{
        //     passive: false,
        //     capture: true
        // })
    }

    componentDidUpdate(prevProps) {
        if(prevProps.nodeSize.height!==this.props.nodeSize.height){
            this._wrapRef.current.scrollTo(this.completeScrollDiv(
                prevProps.nodeSize,
                this.props.nodeSize,
                this._preWrapState
            ));
        }
    }

    componentWillUnmount() {
        this._serve.disconnect();
        if(this._asyncReRenderId) {
            clearTimeout(this._asyncReRenderId);
            console.info('清理重新渲染任务');
        }
    }

    render() {
        const wrap=this._wrapRef.current;
        if(wrap){
            this._preWrapState={
                top: wrap.scrollTop,
                left: wrap.scrollLeft,
                width: wrap.clientWidth,
                preHeight: wrap.clientHeight
            };
        }
        return <div
            className={css.wrap}
            ref={this._wrapRef}
        >
            {this.creatChildrenComponents()}
        </div>
    }
}