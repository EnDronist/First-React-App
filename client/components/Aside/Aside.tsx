// React
import React from 'react';
import Authorization from './Authorization';
// Misc
import classNames from 'classnames';

export type State = {};

type Props = {};

export default class Aside extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }
    
    render = () => {
        return (
            <aside>
                <Authorization />
                <nav>
                    <h1>Blogroll</h1>
                    <ul className="links">
                        <li><a href="#">A List of</a></li>
                        <li><a href="#">Friendly Blogs</a></li>
                        <li><a href="#">That have Exchanged</a></li>
                        <li><a href="#">Links with Us</a></li>
                    </ul>
                </nav>
                <section>
                    <blockquote className="col-12">Плотину надо поднять. Рычагом. Я его дам. Канал надо завалить камнем. Камень я не дам.</blockquote>
                    <a className="twitterHandle" href="#">Ящер из Проклятых Земель</a>
                </section>
            </aside>
        );
    }
}