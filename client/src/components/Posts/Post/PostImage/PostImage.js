import React from 'react';
import classes from './PostImage.module.css';

const PostImage = (props) => {

    return (
        <div className={classes.PostImage}>
            <img src={props.src} alt='post pic' />
        </div>
    );

}

export default PostImage;