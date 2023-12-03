import React from "react";

const SvgIcon = (props) => {

    const valid_heights = {
        xs: 10,
        sm: 15,
        md: 20,
        lg: 30,
        xl: 50,
    }
    
    return (
        
            <svg 
                onClick={props.onClick ? props.onClick : () => {}}
                className={`custom-svg-icon ${props.className ? props.className : ''}`}
                ref={props.ref}
                // height={props.size ? valid_heights[props.size] ? valid_heights[props.size] + 'px' : '15px'  : '15px'} 
                // width={props.size ? valid_heights[props.size] ? valid_heights[props.size] + 'px' : '15px'  : '15px'} 
                version="1.1" 
                xmlns="http://www.w3.org/2000/svg" 
	            viewBox="0 0 448 512"
            >
                <g>
                    <path d={ props.icon ? props.icon.value : '' }/>

                    
                </g>
                {
                   
                }
            </svg>
    )
}

export default SvgIcon