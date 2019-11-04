import {
    Text,
    FlipperPlugin
} from 'flipper';
import React from 'react';

export default class HelloWorld extends FlipperPlugin<any, any, any> {
    render() {
        return (
            <div>
                <Text>HelloWorld</Text>
            </div>
        )
    }   
}