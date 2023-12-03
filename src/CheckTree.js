import React, {useEffect, useState, useRef} from "react";

import CheckElement from "./CheckElement";
import './scss/style.css'
import {angleUp, angleDown, close} from './svg/svgsIcons'
import SvgIcon from "./svg/SvgIcon";

var optionsTreeHelper = []

const CheckTree = (props) => {
    const treeRef = useRef()
    const showerRef = useRef()
    const stateRef = useRef();
    const [rand, setRand] = useState(Math.ceil(Math.random() * 100000))
    const [selectedElements, setSelectedElements] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [showTree, setShowTree] = useState(false)
    const [optionTree, setOptionTree] = useState(null)
    const parent_value = []
    

    useEffect(() => {
        treeRef.current.addEventListener('click', (e) => {
            if (props.debug) console.log('treeRef click', treeRef)
            
            if (showerRef.current && (e.target == showerRef.current || showerRef.current.contains(e.target))) return;
            setShowTree(true)
            
        })

        const handleClickOutsideBox = (event) => {
            if (!treeRef.current.contains(event.target)) {
                if (props.debug) console.log('handleClickOutsideBox', event, !treeRef.current.contains(event.target))
                setShowTree(false)
            }
        }

        document.addEventListener('click', handleClickOutsideBox);

        if (props.showOnlyParent) {
            const selected = initChosen(props.value)

        }
        
        return () => {
            document.removeEventListener('click', handleClickOutsideBox);
        }
    }, [])

    const compareStrings = (a, b) => {
        const normalized_a = a.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
        const normalized_b = b.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
        return normalized_a.includes(normalized_b)
    }

    const checkShow = (option) => {
        for (let i = 0; i < option.length; i++) {
            if (compareStrings(option[i].label, searchValue)) return {
                showSelf: true,
                showChildren: false,
            }
            else if (option[i].children && option[i].children.length > 0) {
                let children = checkShow(option[i].children)
                if (children.showSelf || children.showChildren) {
                    return {
                        showSelf: true,
                        showChildren: true,
                    }
                }
            }   
        }
        
        
        return {
            showSelf: false,
            showChildren: false,
        }
    }

    const buildOptionTree = (option, setShow = false) => {
        return (
            <CheckElement
                name={option.label}
                value={option.value}
                parent={option.parent}
                onChange={(e) => onchange(e)}
                className={`ct-${rand}-elem`}
                id={`ct-${rand}-elem-${option.value}`}
                key={`check-item-${option.value}`}
                show={(setShow || searchValue.length > 0) ? checkShow([option]) : true}
            >
                {
                    option.children ?
                    option.children.map(o => {
                        return buildOptionTree(o, setShow)
                    }) : ''
                }
            </CheckElement>
        )
    }

    const findOption = (value, options) => {
        
        const found = options.filter(o => o.value === value)

        if (found.length > 0) {
            return found[0]
        }

        let recursive_search_result = false;
        options.forEach(o => {
            if (o.children && o.children.length > 0) {
                let search = findOption(value, o.children)
                if (search) {
                    recursive_search_result = search
                    return
                }
            }
        })

        return recursive_search_result
    }

    const fetchChildren = (options) => {
        let ret = options.map(o => {
            return {
                label: o.label,
                value: o.value
            }
        })

        options.forEach(o => {
            if (o.children && o.children.length > 0) {
                ret = ret.concat(fetchChildren(o.children))
            }
        })

        return ret
    }

    const flattenObj = (ob) => {
        const data = []

        ob.forEach(o => {
            if (o.children) {
                const temp = flattenObj(o.children)
                temp.forEach(t => {
                    data.push({
                        value: t.value,
                        parent: t.parent,
                    })
                })
            }
            data.push({
                value: o.value,
                parent: o.parent,
            })
        })

        return data
    };

    const hierarcySearch = (tree, ids = [], level = 0, parent = null) => {
        tree.forEach(t => {

            if (!ids[level]) ids[level] = []

            if (t.children && t.children.length > 0) {
                hierarcySearch(t.children, ids, (level + 1), t.value)
            }
            else if (level == 0) {
                ids[level + 1].push(t.value)
            }

            if (parent && !ids[level].includes(parent)) {
                ids[level].push(parent)
            }
        })

        return ids
    }
    const initChosen = (selected) => {
        let sel = []
        if (selected) {
            selected.forEach(e => {
            
                if (sel.filter(s => s.value === e.value).length === 0) {
                    sel.push(e)
                    const choice = findOption(e.value, props.options)
                    
                    if (choice.children) {
                        const children = fetchChildren(choice.children)
                        sel = children.filter(c => sel.filter(s => s.value === c.value).length === 0).concat(sel)
                    }
                    
                }
                
            })
        }
        

        sel = onChangeParent(sel)
        if (props.onChange)
            props.onChange(sel)
    }

    const onchange = (e, force_uncheck = false) => {
        const elem = document.getElementById(`ct-${rand}-elem-${e.value}`)
        let sel = [];
        
        sel = JSON.parse(JSON.stringify(stateRef.current))
        if (elem.checked && !force_uncheck) {
            if (sel.filter(s => s.value === e.value).length === 0) {
                sel.push(e)

                if (props.checkAllByParent) {
                    const choice = findOption(e.value, props.options)
                    
                    if (choice.children) {
                        // hierarcySearch(optionsTreeHelper)
                        const children = fetchChildren(choice.children)
                        sel = children.filter(c => sel.filter(s => s.value === c.value).length === 0).concat(sel)
                    }
                }
            }
        } else {
            if (props.checkAllByParent) {
                const choice = findOption(e.value, props.options)
                
                if (choice.children) {
                    const children = fetchChildren(choice.children)
                    const to_remove = sel.filter(s => children.filter(c => c.value === s.value).length > 0)
                    sel = sel.filter(s => children.filter(c => c.value === s.value).length === 0)
                }
                
                sel = sel.filter(s => s.value !== e.parent)
            }
            sel = sel.filter(s => s.value !== e.value)

        }
        if (props.showOnlyParent) {
            sel = onChangeParent(sel)
        }
        if (props.onChange)
            props.onChange(sel)
    }

    const onChangeParent = (sel) => {
        optionsTreeHelper = JSON.parse(JSON.stringify(props.options)).map(o => {
            return {
                ...o,
                isSelected: false
            }
        })
        
        const to_search = (hierarcySearch(optionsTreeHelper))
        if (props.debug) console.log('to_search', to_search)
        var parentValues = []
        for (let i = to_search.length - 1; i >= 0; i--) {
            let is_checked = true
            
            if (!to_search[i] || to_search[i].length === 0) continue;
            to_search[i].forEach(s => {
                let all_children_checked = true
                const choice = findOption(s, props.options)
                const options_to_push = []
                if (choice.children) { 
                    choice.children.forEach(c => {
                        if (sel.filter(s1 => s1.value === c.value).length === 0) {
                            all_children_checked = false
                        }
                        else {
                            options_to_push.push(c.value)
                        }
                        
                    })
                }
                else if (sel.filter(s1 => s1.value === choice.value).length === 0) all_children_checked = false;

                if (all_children_checked) {
                    parentValues = parentValues.filter(p1 => {return options_to_push.indexOf(p1) === -1})
                    parentValues.push(s)

                    if (sel.filter(s1 => s1.value === s).length === 0) {
                        sel.push({
                            label: choice.label,
                            value: choice.value,
                            parent: choice.parent,
                        })
                    }
                }
                else {
                    is_checked = false
                    const holder = parentValues.concat(options_to_push)
                    parentValues = holder.filter((item, pos) => holder.indexOf(item) === pos)
                    sel = sel.filter(s1 => s1.value !== s)
                }
                
            })
            if (is_checked && to_search[i].length > 0) {
                parentValues = JSON.parse(JSON.stringify(to_search[i]))
            }
        }
        if (props.onChangeParent)
            props.onChangeParent(parentValues)

        return sel
    }

    useEffect(() => {
        setSelectedElements(props.value ? props.value : [], false)
    }, [props.value])

    useEffect(() => {
        
        stateRef.current = selectedElements;
        const elems = document.querySelectorAll(`.ct-${rand}-elem`)
        if (elems)
        elems.forEach(tr => {
            const refElem = document.getElementById(`ct-${rand}-elem-${tr.value}`)
            refElem.checked = false
        })
        if (selectedElements)
        selectedElements.forEach(tr => {
            const refElem = document.getElementById(`ct-${rand}-elem-${tr.value}`)
            if (refElem)
                refElem.checked = true
        })

        if (props.showOnlyParent) {
            onChangeParent(selectedElements)
        }
    }, [selectedElements])

    useEffect(() => {
        if (props.options)
            setOptionTree(props.options.map(option => buildOptionTree(option, true)))
    }, [searchValue])

    useEffect(() => {
        if (props.options)
            setOptionTree(props.options.map(option => buildOptionTree(option)))
    }, [props.options])

    const onAngleClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (props.debug) console.log('onAngleClick', showerRef)
        setShowTree(!showTree)
    }

    return <div className={`react-check-tree ${props.className ? props.className : ''}`} ref={treeRef}>
        <div className={`tree-controller ${showTree ? 'tree-opened' : ''}`}>
            <div className="tree-controller-container">
            
                {
                    selectedElements && 
                    selectedElements.map(e => {
                        if (props.showOnlyParent) { 
                            if (props.parent_value && !props.parent_value.includes(e.value)) return
                        }
                        return (
                            <span key={`selected_${e.value}`} className="selected-choice" onClick={(event) => {
                                event.stopPropagation()
                                // const sel = selectedElements.filter(s => s.value !== e.value)
                                onchange(e, true)
                                // props.onChange(sel)
                                // onchange({...e, checked: false}, e.ref)
                            }}>
                                {e.label}
                                <SvgIcon icon={close} />
                            </span>
                        )
                    })
                }
                <input type="text" value={searchValue} placeholder={props.placeholder && selectedElements.length === 0 ? props.placeholder : ''} onChange={(e) => setSearchValue(e.target.value)} />
            </div>
            <div className="tree-controller-indicators" ref={showerRef} onClick={onAngleClick}>
                <SvgIcon className="tree-shower" icon={showTree ? angleUp : angleDown} size="lg" />
                
                
            </div>
        </div>
        <div className={`tree-root tree-choices ${showTree ? '' : 'tree-choices-hide'}`}>
            {optionTree}
        </div>
    </div>

}

export default CheckTree