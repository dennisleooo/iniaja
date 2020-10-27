import React, { createRef } from 'react'
import Axios from "axios"
import {API_URL} from '../helpers/apiurl'
import { Breadcrumb, BreadcrumbItem,Modal,ModalBody,ModalFooter,ModalHeader} from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

class Home extends React.Component{
    state={
        nama: createRef(),
        usia: createRef(),
        pekerjaan: createRef(),
        dataUsers:[],
        isOpen:false,
        namaEdit: createRef(),
        usiaEdit: createRef(),
        pekerjaanEdit: createRef(),
        indexEdit:0,
        idEdit:-1,
        optionPekerjaan: [],
        showData: 1,
        indexFilter: 0,
        idFilter: 0
    }

    componentDidMount(){
        Axios.get(`${API_URL}/users`)
        .then((res)=>{
            console.log(res.data)
            this.setState({dataUsers:res.data})
        }).catch((err)=>{
            console.log(err)
        })
    }

    onAddDataClick=()=>{
        var {nama,usia,pekerjaan}=this.state
        var nama = nama.current.value
        var usia = usia.current.value
        var pekerjaan = pekerjaan.current.value
        var obj={nama,usia,pekerjaan}
        console.log(obj)
        Axios.post(`${API_URL}/users`, obj)
        .then((res)=>{
            Axios.get(`${API_URL}/users`)
            .then((res1)=>{
                alert("sukses menambah data")
                this.setState({dataUsers:res1.data})
                console.log(this.state.dataUsers);

            }).catch((err)=>{
                console.log(err)
            })
        }).catch((err)=>{
            console.log(err)
        })
    }

    onEditClick=(id, index)=>{
        this.setState({indexEdit:index, isOpen:true, idEdit:id})
        console.log(index)
        console.log(this.state.dataUsers[index].nama)
        
    }

    renderOptionPekerjaan=()=>{
        return this.state.dataUsers.map((val, index)=>{
            return (
                <option key={index} value={index} >{val.pekerjaan}</option>
            )
        })
    }

    changeData=(id, index)=>{
        this.setState({showData : 2, idFilter: id, indexFilter: index})
        console.log(index, 'activate', this.state.showData)
    }

    renderFilterData=()=>{
        return this.state.dataUsers[this.state.indexFilter].map((val,index)=>{
            return (
                <tr>
                    <td>{val.nama}</td>
                    <td>{val.usia}</td>
                    <td>{val.pekerjaan}</td>
                    <td>
                        <button onClick={()=>this.onEditClick(val.id, index)} className="btn btn-primary mr-3">edit</button>
                        <button onClick={()=>this.Ondelclick(val.id, index)} className="btn btn-danger">delete</button>
                    </td>
                </tr>
            )
        })
    }

    renderDataTable=()=>{
        return this.state.dataUsers.map((val,index)=>{
            return (
                <tr>
                    <td>{val.nama}</td>
                    <td>{val.usia}</td>
                    <td>{val.pekerjaan}</td>
                    <td>
                        <button onClick={()=>this.onEditClick(val.id, index)} className="btn btn-primary mr-3">edit</button>
                        <button onClick={()=>this.Ondelclick(val.id, index)} className="btn btn-danger">delete</button>
                    </td>
                </tr>
            )
        })
    }

    onDeleteAllClick=()=>{
        return this.state.dataUsers.forEach((val)=>{
            return (
                Axios.delete(`${API_URL}/users/${val.id}`)
                .then(()=>{
                    console.log("sukses delete semua")
                    window.location.reload()
                }).catch((err)=>{
                    console.log(err)
                })
            )
        })
    }

    onSaveeditClick=()=>{
        var nama=this.state.namaEdit.current.value
        var usia=this.state.usiaEdit.current.value
        var pekerjaan=this.state.pekerjaanEdit.current.value
        var objEdit={nama,usia,pekerjaan}
        console.log(objEdit)
        Axios.put(`${API_URL}/users/${this.state.idEdit}`, objEdit)
        .then((res)=>{
            Axios.get(`${API_URL}/users`)
            .then((res1)=>{
                alert("sukses edit data")
                this.setState({dataUsers:res1.data, isOpen:false})
                console.log(this.state.dataUsers);
            }).catch((err)=>{
                console.log(err)
            })
        }).catch((err)=>{
            console.log(err)
        })

    }

    Ondelclick=(id, index)=>{
        MySwal.fire({
          title: `Are you sure want to delete ${this.state.dataUsers[index].nama}?`,
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if (result.value) {
            Axios.delete(`${API_URL}/users/${id}`)
            .then((res)=>{
              MySwal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
              )
              window.location.reload()
            }).catch((err)=>{
              console.log(err)
            })
          }
        })
      }


    render(){
        return(
            <div>
                <Modal isOpen={this.state.isOpen} toggle={()=>this.setState({isOpen:false})} >
                    <ModalHeader toggle={()=>this.setState({isOpen:false})}>Edit Data</ModalHeader>
                    <ModalBody>
                        <input ref={this.state.namaEdit} type='text' className='form-control' placeholder='nama' />
                        <input ref={this.state.usiaEdit} type='text' className='form-control' placeholder='usia' />
                        <input ref={this.state.pekerjaanEdit} type='text' className='form-control' placeholder='pekerjaan' />
                    </ModalBody>
                    <ModalFooter>
                    <button color="primary" onClick={this.onSaveeditClick}>Save</button>{' '}
                    <button color="secondary" onClick={()=>this.setState({isOpen:false})}>Cancel</button>
                    </ModalFooter>
                </Modal>
                <div>
                    <h1>SOAL 1</h1>
                    <div className='row'>
                        <div className='col-md-4 mb-4'>
                            <select onChange={this.changeData} className='form-control'>
                                {
                                    this.state.dataUsers ?
                                    <>
                                    <option value='all'>All</option>
                                    {this.renderOptionPekerjaan()}
                                    </>
                                    : 
                                    <option>Filter By Pekerjaan</option>
                                }
                            </select>
                        </div>
                    </div>
                    <table className='table mb-4'>
                        <thead>
                            <tr>
                                <td>Nama</td>
                                <td>Usia</td>
                                <td>Pekerjaan</td>
                                <td>Act</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.showData == 1 ? this.renderDataTable()
                                : this.renderFilterData()
                            }
                        </tbody>
                    </table>
                    <div className='row'>
                        <div className='col-md-3'>
                            <input ref={this.state.nama} type='text' className='form-control' placeholder='Nama' />
                        </div>
                        <div className='col-md-3'>
                            <input ref={this.state.usia} type='text' className='form-control' placeholder='Usia' /> 
                        </div>
                        <div className='col-md-3'>
                            <input ref={this.state.pekerjaan} type='text' className='form-control' placeholder='Pekerjaan' />
                        </div>
                        <div className='col-md-3'>
                            <input type='button' onClick={this.onAddDataClick} className='form-control btn-info mr-3' value='add Data' />
                            <input type='button' onClick={this.onDeleteAllClick} className='form-control btn-danger' value='delete all data' />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Home