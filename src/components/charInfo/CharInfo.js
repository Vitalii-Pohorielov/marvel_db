import { Component } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spiner from '../spiner/Spiner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

class CharInfo extends Component {

    state = {
        char: null,
        loading: false,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar();
    }

    componentDidUpdate(prevProps) {
        if(this.props.charId !== prevProps.charId) {
            this.updateChar();
        }

    }


    updateChar = () => {
        const {charId} = this.props;
        if(!charId) {
            return;
        }

        this.onCharLoading();

        this.marvelService     
            .getCharacter(charId)
            .then(this.onCharLoaded)
            .catch(this.onError);
    }

    onCharLoaded = (char) => {
        this.setState({ char, loading: false });
    }

    onCharLoading = () => {
        this.setState({
            loading: true
        })
    }

    onError = () => {
        this.setState({ loading: false, error: true });
    }


    render() {
        const {char, loading, error} = this.state;

        const skeleton =  char || loading || error ? null : <Skeleton/>
        // Если есть загрузк,персонаж,ошибка то ничего не выводится... ИНАЧЕ выводтся компонент <Скелетон>
        const errorMessage = error ? <ErrorMessage /> : null;
        // Если сечас ошибка-загрузка то выводим их ... ИНАЧЕ - ничего
        const spiner = loading ? <Spiner /> : null;
        const content = !(loading || error || !char) ? <View char={char} /> : null;
        // Если у нас сейчас нет загрузки ИЛИ нет ошибки то выводим контент ИНАЧЕ - ничего

        return (
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {spiner}
                {content}
 
            </div>
        )

    }
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;

    let imgStyle = { 'objectFit': 'cover' };
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = { 'objectFit': 'contain' };
    }

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle} />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">    
                {comics.length > 0 ? null : 'This Character has not comics...'}    
                {
                    comics.map((item, i) => {
                        if (i > 4) {
                            return;
                        }
// Этим Условием мы ограничиваем количесвто отображаемых элементов(5 комиксов)
                        return (
                            <li key={i} className="char__comics-item">
                                {item.name}
                            </li>
                        )
                    })
                }       

            </ul>
        </>
    )
}


CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;