const Button =document.querySelector('button');
const close =document.querySelector('.close');
const trailer =document.querySelector('.trailer');
const video =document.querySelector('video');

Button.addEventListener('click', () =>
{
    trailer.style.visibility ="visible";

    trailer.style.opacity =1;

    
    if (video.hidden = true)
    {
        video.hidden=false;
    }

    
    });

close.addEventListener('click', () =>
{
    trailer.style.visibility ="hidden";

    trailer.style.opacity =0;

        
    video.pause();
    video.currentTime=0;
    
    });
