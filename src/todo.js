import React from 'react'
import { useState } from 'react'
import "./App.css"
// import Moralis from 'moralis/types';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import { useEffect } from 'react';
import { concat, id } from 'ethers/lib/utils';


export default function Todo() {
    const [inputData, setInputData] = useState('');
    const [item, setItem] = useState([]);
    // const [Pageload, setPageload]=useState(false)
    const [Submittoggle, setSubmittoggle] = useState(true);
    const [isEditItem, setIsEditItem] = useState(null)
    const [id, setId] = useState()

    const { Moralis, user, setUserData, isUserUpdating } = useMoralis();
    const { data } = useMoralisQuery("TodoItems");    //---For fetching(Get)the data from moralis



    // Add item moralis ----------------------------------------------->
    const addItem = () => {
        if (!inputData) {
            alert("Please Fill the field");
        } else if (inputData && !Submittoggle) {
            setItem(
                data.map((e) => {

                    if (e.id === isEditItem) {
                        return { ...e, Item: inputData }
                    }
                    return e;
                })
            );
            setSubmittoggle(false);
            setInputData("");


        } else {
            setSubmittoggle(true);
            setItem([...item, inputData])
            setInputData('')
            setIsEditItem(null)
        }


    }

    // ---------------------------Crete obj in moralis------------------------
    // This code for add the data in Moralis and AFTER alse Edit the data in Moralis.

    useEffect(() => {
        if (item.length !== 0) {
            definenewMoralisobj();
        }
    }, [item])

    const definenewMoralisobj = () => {
        // alert("called")

        item.map(async (Mdata) => {
            // console.log(todoItem, 'todooo');

            if (Submittoggle) {
                const TodoItems = Moralis.Object.extend("TodoItems");
                const todoItem = new TodoItems();
                todoItem.set('Item', Mdata);
                await todoItem.save();

            } else {
                // This is edit code in moralis database & (2nd-code--> edit code in add item function if else()
                console.log(isEditItem, "isEditItem----")
                console.log("Mdata", Mdata)
                const query = new Moralis.Query('TodoItems')
                console.log("query", query);
                query.equalTo('objectId', isEditItem)

                const object = await query.first()

                object.set('Item', Mdata.Item);

                await object.save();


            }

        })

    }


    // Delete item moralis ----------------------------------------------->
    const deleteItem = async (id) => {
        const query = new Moralis.Query('TodoItems')
        query.equalTo('objectId', id)
        const object = await query.first()
        if (object) {
            object.destroy({}).then(() => {
                alert("Delete---->");
            }, (error) => {
                console.log(error);
            })
        }
    }

    // -------------------------EDIT data------------------------------------------
    // When user click on edit button what we need to do |
    // 1)get the id and name of the data which user clicked to edit
    // 2)set the toggle mode to change the "Submit btn" in to "Update btn or edit btn"
    // 3)Now update the value of the setInput(usestate) with the new updated value to edit
    // 4)To pass the current Id to new state variable for reference
    const editItem = (id) => {


        var update = data.find((element) => {
            // console.log(element, 'ele===>');

            return element.id === id;

        });
        console.log(update, 'Click on edit===>');
        setSubmittoggle(false);

        setInputData(update.attributes.Item); //Perticular data after click on edit icon
        setIsEditItem(id)
    }


    return (
        <>
            <div className='main'>
                <div className='textarea'>
                    <input type="text" placeholder='Enter your task' value={inputData} onChange={(e) => setInputData(e.target.value)}></input>
                    {/* {console.log(inputData)} */}

                    {
                        Submittoggle ?
                            <button className='btn' onClick={addItem}>Submit</button>
                            :
                            <button className='btn' onClick={addItem}>Update Data</button>
                    }
                    {/* {console.log(item)} */}
                </div>
                <div className='container'>
                    <div className='showItems'>
                        {data.map((displayitem, index) => {
                            // { console.log(data, 'mappppp'); }
                            return <div className=' container eachItems' key={index}>
                                <h3>{displayitem.attributes.Item}</h3>
                                {/* {console.log(displayitem.attributes.Item, "----------")} */}
                                {/* {console.log("Display --->", displayitem)} */}


                                <button className='btn' style={{ margin: "15px" }}>
                                    <i className='fa fa-trash add-btn' title='dlete Item' onClick={() => deleteItem(displayitem.id)}></i>
                                    {" "}<br></br>

                                </button>

                                <button className='btn' >
                                    <i className='fa fa-edit add-btn' title='Edit Item' onClick={() => editItem(displayitem.id)}></i>
                                </button>
                            </div>
                        })

                        }
                    </div>
                </div>
            </div>

        </>)
}
