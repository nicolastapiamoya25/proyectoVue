
<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar text color="white">
                <v-toolbar-title>Usuarios</v-toolbar-title>
                    <v-divider
                    class="mx-2"
                    inset
                    vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Búsqueda" single-line hide-details></v-text-field>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn v-bind="attrs" v-on="on"  color="primary" dark class="mb-2">Nuevo</v-btn>
                        </template>    
                        <v-card>
                            <v-card-title>
                            <span class="headline">{{ formTitle }}</span>
                            </v-card-title>
                
                            <v-card-text>
                            <v-container grid-list-md>
                                <v-layout wrap>
                                <v-flex xs6 sm6 md6>
                                    <v-select v-model="idrol" :items="roles" label="Rol">
                                    </v-select>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="nombre" label="Nombre"></v-text-field>
                                </v-flex>
                                <v-flex xs6 sm6 md6>
                                    <v-select v-model="tipo_documento" :items="documentos" label="Tipo de Documento">
                                    </v-select>
                                </v-flex>
                                <v-flex xs6 sm6 md6>
                                    <v-text-field v-model="num_documento" label="N° de Documento"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="direccion" label="Dirección"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="telefono" label="Teléfono"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="email" label="Email"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field type="password" v-model="password" label="Contraseña"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12 v-show="valida">
                                    <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v">
                                    </div>
                                </v-flex>
                                </v-layout>
                            </v-container>
                            </v-card-text>
                
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click.native="close">Cancelar</v-btn>
                                <v-btn color="blue darken-1" text @click.native="guardar">Guardar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="adModal" max-width="290">
                        <v-card>
                            <v-card-title class="headline" v-if="adAccion==1">¿Activar Item?</v-card-title>
                            <v-card-title class="headline" v-if="adAccion==2">Desactivar Item?</v-card-title>
                            <v-card-text>
                                Estas a punto de 
                                <span v-if="adAccion==1">Activar</span>
                                <span v-if="adAccion==2">Desactivar</span>
                                el Item {{ adNombre }}
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary darken-1" flat="flat" @click="activarDesactivarCerrar">Cancelar</v-btn>
                                <v-btn v-if="adAccion==1" color="danger darken-4" flat="flat" @click="activar" >Activar</v-btn>
                                <v-btn v-if="adAccion==2" color="danger darken-4" flat="flat" @click="desactivar" >Desactivar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            <v-data-table
                :headers="headers"
                :items="usuarios"
                :search="search"
                class="elevation-1"
            >
                <template v-slot:item.opciones="{ item }">
                    <v-icon small class="mr-2" @click="editItem(item)">create</v-icon>
                    <template v-if="item.condicion">
                        <v-icon small @click="activarDesactivarMostrar(2,item)">block</v-icon> 
                    </template>
                    <template v-else>
                            <v-icon small @click="activarDesactivarMostrar(1,item)">check</v-icon> 
                        </template>
                    </template>
                <template v-slot:items="{ props }">
                <td>{‌{ props.item.rol }}</td>
                <td>{‌{ props.item.nombre }}</td>
                <td>{‌{ props.item.tipo_documento }}</td>
                <td>{‌{ props.item.num_documento }}</td>
                <td>{‌{ props.item.direccion }}</td>
                <td>{‌{ props.item.telefono }}</td>
                <td>{‌{ props.item.email }}</td>
                <td>{‌{ props.item.password }}</td>
                </template>
                <template v-slot:item.condicion="{ item }">
                    <div v-if="item.condicion">
                        <span class="blue--text">Activo</span>
                    </div>
                    <div v-else>
                        <span class="red--text">Inactivo</span>
                    </div>
                </template>    
                <template slot="no-data">
                <v-btn color="primary" @click="listar()">Resetear</v-btn>
                </template>
            </v-data-table>
        </v-flex>
    </v-layout>
</template>


<script>
    import axios from 'axios'
    export default {
        data(){
            return {
                usuarios:[],                
                dialog: false,
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: 'Rol', value: 'rol' },
                    { text: 'Nombre', value: 'nombre' },
                    { text: 'Tipo Documento', value: 'tipo_documento' },
                    { text: 'N° Documento', value: 'num_documento' },
                    { text: 'Direccion', value: 'direccion' },
                    { text: 'Teléfono', value: 'telefono', sortable: false  },
                    { text: 'Email', value: 'email', sortable: false  },
                    { text: 'Estado', value: 'condicion', sortable: false  }
                                   
                ],
                search: '',
                editedIndex: -1,
                editedItem: {
                    name: '',
                    calories: 0,
                    fat: 0,
                    carbs: 0,
                    protein: 0
                },
                id: '',
                idrol: '',
                roles:[],
                nombre: '',
                tipo_documento: '',
                documentos: ['DNI','RUT','PASAPORTE'],
                num_documento: '',
                direccion: '',
                telefono: '',
                email: '',
                password: '',
                actPassword:false,
                passwordAnt: '',
                valida: 0,
                validaMensaje:[],
                adModal: 0,
                adAccion: 0,
                adNombre: 0,
                adId: ''            
            }
        },
        computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'Nuevo Usuario' : 'Actualizar Usuario'
            }
        },

        watch: {
            dialog (val) {
            val || this.close()
            }
        },

        created () {
            this.listar();
            this.select();
        },
        methods:{
            listar(){
                let me = this;
                axios.get('api/Usuarios/Listar').then(function(response){
                    //console.log(response);
                    me.usuarios=response.data;
                }).catch(function(error){
                    console.log(error);
                });
            },
            select(){
                let me = this;
                var rolesArray = [];
                axios.get('api/Roles/Select').then(function(response){
                    rolesArray = response.data;
                    rolesArray.map(function(x){
                        me.roles.push(
                            {text: x.nombre, value: x.idrol});
                    });
                }).catch(function(error){
                    console.log(error);
                });
            },
            editItem (item) {
                this.id = item.idusuario;
                this.idrol = item.idrol;
                this.nombre = item.nombre;
                this.tipo_documento = item.tipo_documento;
                this.num_documento = item.num_documento;
                this.direccion = item.direccion;
                this.telefono = item.telefono;
                this.email = item.email;
                this.password = item.password_hash;
                this.passwordAnt = item.password_hash;
                this.editedIndex = 1;
                this.dialog = true
            },
            close () {
                this.dialog = false;
                this.limpiar();
            },
            limpiar(){
                this.id = "";
                this.idrol = "";
                this.nombre = "";
                this.tipo_documento = "";
                this.num_documento = "";
                this.direccion = "";
                this.telefono = "";
                this.email = "";
                this.password = "";
                this.passwordAnt = "";
                this.actPassword = false;
                this.editedIndex=-1;
            },
            guardar () {
                if(this.validar()){
                    return;
                }
                if (this.editedIndex > -1) {
                    //Código para editar
                    let me=this;
                    if(me.password != me.passwordAnt){
                        me.actPassword = true;
                    }

                    axios.put('api/Usuarios/Actualizar',{
                        'idusuario' : me.id,
                        'idrol' : me.idrol,
                        'nombre' : me.nombre,
                        'tipo_documento' : me.tipo_documento,
                        'num_documento' : me.num_documento,
                        'direccion': me.direccion,
                        'telefono' : me.telefono,
                        'email' : me.email,
                        'password' : me.password,
                        'act_password' : me.actPassword
                    }).then(function(response){
                        me.close();
                        me.listar();
                        me.limpiar();                        
                    }).catch(function(error){
                        console.log(error);
                    });
                } else {
                    //Código para guardar
                    let me=this;
                    axios.post('api/Usuarios/Crear',{
                        'idrol' : me.idrol,
                        'nombre' : me.nombre,
                        'tipo_documento' : me.tipo_documento,
                        'num_documento' : me.num_documento,
                        'direccion': me.direccion,
                        'telefono' : me.telefono,
                        'email' : me.email,
                        'password' : me.password
                    }).then(function(response){
                        me.close();
                        me.listar();
                        me.limpiar();                        
                    }).catch(function(error){
                        console.log(error);
                    });
                }
            },
            validar(){
                this.valida = 0;
                this.validaMensaje = [];
                if(this.nombre.length<3 || this.nombre.length>50){
                    this.validaMensaje.push("El nombre debe tener mas de 3 caracteres y menos de 50");
                }
                if(!this.idrol){
                    this.validaMensaje.push("Seleccione un Rol");
                }
                if(!this.nombre || this.nombre==""){
                    this.validaMensaje.push("Ingrese el nombre");
                }
                if(!this.num_documento || this.num_documento==0){
                    this.validaMensaje.push("Ingrese el numero de documento");
                }
                if(!this.direccion || this.direccion==""){
                    this.validaMensaje.push("Ingrese el Direccion");
                }
                if(!this.tipo_documento || this.tipo_documento==""){
                    this.validaMensaje.push("Ingrese el numero de Tipo de documento");
                }
                if(!this.telefono || this.telefono==""){
                    this.validaMensaje.push("Ingrese el telefono");
                }
                if(!this.password || this.password==""){
                    this.validaMensaje.push("Ingrese el password");
                }
                if(this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },
            activarDesactivarMostrar(accion,item){
                this.adModal = 1;
                this.adNombre = item.nombre;
                this.adId = item.idusuario;

                if(accion==1){
                    this.adAccion = 1;

                }
                else if(accion==2){
                    this.adAccion = 2;
                }else{
                    this.adModal = 0;
                }
            },
            activarDesactivarCerrar(){
                this.adModal = 0;
            },
            activar(){
                let me=this;
                axios.put('api/Usuarios/Activar/'+this.adId,{

                }).then(function(response){
                    me.adModal = 0;
                    me.adAccion = 0
                    me.adNombre = "";
                    me.adId = "";
                    me.listar();                       
                }).catch(function(error){
                    console.log(error);
                });
            },
            desactivar(){
                let me=this;
                axios.put('api/Usuarios/Desactivar/'+this.adId,{

                }).then(function(response){
                    me.adModal = 0;
                    me.adAccion = 0
                    me.adNombre = "";
                    me.adId = "";
                    me.listar();                       
                }).catch(function(error){
                    console.log(error);
                });
            }
        }        
    }
</script>
