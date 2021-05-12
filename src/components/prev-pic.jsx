import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

function PrevPic(props) {
    return <div className='previous-grouop' onClick={() => props.onClick(props.group)}><FontAwesomeIcon icon={faTimes}
        className="delete-prev-pic-icon" onClick={() => console.log('hi')} />第{props.group}組圖片</div>
}

export default PrevPic;