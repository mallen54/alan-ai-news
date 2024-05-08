import React, {useState, useEffect} from 'react';
import alanBtn from '@alan-ai/alan-sdk-web';
import useStyles from './styles.js';
import wordsToNumbers from 'words-to-numbers';
import NewsCards from './components/NewsCards/NewsCards';
import { Typography } from '@material-ui/core';

const alanKey = 'f5e058498459dab6d1bf5b9b45429cba2e956eca572e1d8b807a3e2338fdd0dc/stage';

const App = () => {

    const [newsArticles, setNewsArticles] = useState([]);
    const [activeArticle, setActiveArticle] = useState(-1);
    const classes = useStyles();

    useEffect(() => {
        var alanBtnInstance = alanBtn({
            key: alanKey,
            onCommand: (commandData) => {
                if(commandData.command === 'newHeadlines'){
                    setNewsArticles(commandData.articles);
                    setActiveArticle(-1);
                } else if (commandData.command === 'highlight'){
                    setActiveArticle((prevActiveArticle) => prevActiveArticle + 1);
                } else if(commandData.command === 'open'){
                    const parsedNumber = commandData.number.length > 2 ? wordsToNumbers(commandData.number, {fuzzy: true}): commandData.number;
                    const article = commandData.articles[parsedNumber - 1];
                    if(parsedNumber > commandData.articles.length){
                        alanBtnInstance.playText('Please try that again.')
                    } else if(article){
                        window.open(article.url, '_blank');
                        alanBtnInstance.playText('Opening...');
                    }
                }
            }
        })
    }, [])

    return (
        <div className={classes.webPage}>
            <div className={classes.logoContainer}>
                <img src='https://voicebot.ai/wp-content/uploads/2019/10/alan.jpg' className={classes.alanLogo} alt='alan logo'/>
            </div>
            <NewsCards articles={newsArticles} activeArticle = {activeArticle}/>
            {!newsArticles.length ? (
            <div className={classes.footer}>
                <Typography variant="body1" component="h2">
                    Created by
                    <a className={classes.link} href="https://www.linkedin.com/in/michael-allen-a23016142/"> Michael Allen</a>
                </Typography>
            </div>
            ) : null}
        </div>
    );
}

export default App;