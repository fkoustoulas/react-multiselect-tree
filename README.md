# react-multiselect-tree

 react-multiselect-tree is a package that solves the problem of having set a tree with a select UI. After searching on web for similar packages i didn't find any package that could fit my needs.

![](https://github.com/fkoustoulas/react-multiselect-tree/blob/main/src/CPT2312031739-522x540.gif)

 At first, to use this package you must install it via npm:

 ```
 npm install react-multiselect-tree
 ```

 After you installed the package you can use it in your react application by importing the main component CheckTree:

 ```js
 import CheckTree from "react-multiselect-tree"
 ```

The component usage works as follows:

```jsx
<CheckTree 
    className='my-check-tree' //you can add your own class to override default styles
    options={options} 
    onChange={(e) => setSelectedOptions(e)} 
    value={selectedOptions} // value must be present and editable via the onChange event
    debug={true} // show debug messages on console. For development purposes
    checkAllByParent={true} // When this prop is true then when the user checks the parent choice all the child choices are also get checked
    showOnlyParent={true} // When this prop is true then when all the children are checked the parent gets checked also and in the chosen list only the parent is showed
    parent_value={selectedParentOptions} // When showOnlyParent is true then you must declare a parent_value that is different from value because only parent choices are saved
    onChangeParent={(e) => setSelectedParentOptions(e)}
/>
```

The ```options``` prop must be of the following structure:

```js
[
    {
        label: 'test1',
        value: 1,
        children: [
            {
                label: 'test2',
                value: 2
            },
            {
                label: 'test4',
                value: 4,
                children: [
                    {
                        label: 'test11',
                        value: 11
                    },
                    {
                        label: 'test12',
                        value: 12
                    },
                    ...
                ]
            }
        ]
    },
    {
        label: 'test5',
        value: 5
    },
    {
        label: 'test6',
        value: 6
    },
    {
        label: 'test7',
        value: 7,
        children: [
        {
            label: 'test8',
            value: 8
        },
        ...
        ]
    }
]
```

--TODO--
On the next update i will try to remove the need of the parent_value and onChangeParent props.

This package is untested so make sure it works for your specific needs before using it.