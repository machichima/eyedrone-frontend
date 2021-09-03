import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

function PrevPic(props) {
    return <div className='previous-grouop' >
                <FontAwesomeIcon icon={faTimes}
                    className="delete-prev-pic-icon" onClick={() => props.delImg(props.group)} />
                    <div style={{display: "inline"}} onClick={() => props.onClick(props.group)}>第{props.group}組圖片</div>
            </div>
}

export default PrevPic;