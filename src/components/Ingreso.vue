
<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar text color="white">
                <v-toolbar-title>Ingresos</v-toolbar-title>
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
                                    <v-select v-model="tipo_documento" :items="documentos" label="Tipo de Documento">
                                    </v-select>
                                </v-flex>
                                <v-flex xs6 sm6 md6>
                                    <v-text-field v-model="serie_documento" label="Serie de Documento"></v-text-field>
                                </v-flex>
                                <v-flex xs6 sm6 md6>
                                    <v-text-field v-model="num_documento" label="N° de Documento"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="fecha_hora" label="Fecha"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="impuesto" label="Impuesto"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="total" label="total"></v-text-field>
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
                :items="ingresos"
                :search="search"
                class="elevation-1"
            >
                <template v-slot:item.opciones="{ item }">
                    <v-icon small class="mr-2" @click="editItem(item)">create</v-icon>
                    <template v-if="item.conestado=='Aceptado'">
                        <v-icon small @click="activarDesactivarMostrar(2,item)">block</v-icon> 
                    </template>
                    <template v-else>
                            <v-icon small @click="activarDesactivarMostrar(1,item)">check</v-icon> 
                        </template>
                    </template>
                <template v-slot:items="{ props }">
                <td>{‌{ props.item.usuario }}</td>
                <td>{‌{ props.item.proveedor }}</td>
                <td>{‌{ props.item.tipo_documento }}</td>
                <td>{‌{ props.item.serie_documento }}</td>
                <td>{‌{ props.item.num_documento }}</td>
                <td>{‌{ props.item.fecha_hora }}</td>
                <td>{‌{ props.item.impuesto }}</td>
                <td>{‌{ props.item.total }}</td>
                </template>
                <template v-slot:item.estado="{ item }">
                    <div v-if="item.estado">
                        <span class="blue--text">Aceptado</span>
                    </div>
                    <div v-else>
                        <span class="red--text">{‌{ props.item.estado }}</span>
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
                ingresos:[],                
                dialog: false,
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: 'Usuario', value: 'usuario' },
                    { text: 'Proveedor', value: 'proveedor' },
                    { text: 'Tipo Comprobante', value: 'tipo_comprobante' },
                    { text: 'Serie Documento', value: 'serie_comprobante' },
                    { text: 'N° Documento', value: 'num_comprobante' },
                    { text: 'fecha_hora', value: 'fecha_hora' },
                    { text: 'Teléfono', value: 'impuesto', sortable: false  },
                    { text: 'total', value: 'total', sortable: false  },
                    { text: 'Estado', value: 'estado', sortable: false  }
                                   
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
                idusuario: '',
                idproveedor: '',
                tipo_documento: '',
                documentos: ['DNI','RUT','PASAPORTE'],
                serie_documento: '',
                num_documento: '',
                fecha_hora: '',
                impuesto: '',
                total: '',
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
                let header = {"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion = {headers : header};
                axios.get('api/Ingresos/Listar', configuracion).then(function(response){
                    //console.log(response);
                    me.ingresos=response.data;
                }).catch(function(error){
                    console.log(error);
                });
            },
            select(){
                let me = this;
                let header = {"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion = {headers : header};
                var rolesArray = [];
                axios.get('api/Roles/Select', configuracion).then(function(response){
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
                this.id = item.idingreso
                this.idusuario = item.idusuario;
                this.idproveedor = item.idproveedor;
                this.tipo_documento = item.tipo_documento;
                this.serie_comprobante = item.serie_comprobante;
                this.num_documento = item.num_documento;
                this.fecha_hora = item.fecha_hora;
                this.impuesto = item.impuesto;
                this.total = item.total;
                this.editedIndex = 1;
                this.dialog = true
            },
            close () {
                this.dialog = false;
                this.limpiar();
            },
            limpiar(){
                this.id = "";
                this.idusuario = "";
                this.idproveedor = "";
                this.tipo_documento = "";
                this.serie_comprobante = "";
                this.num_documento = "";
                this.fecha_hora = "";
                this.impuesto = "";
                this.total = "";
                this.editedIndex=-1;
            },
            guardar () {
                if(this.validar()){
                    return;
                }
                if (this.editedIndex > -1) {
                    //Código para editar
                    let me=this;
                    let header = {"Authorization" : "Bearer " + this.$store.state.token};
                    let configuracion = {headers : header};
                    
                    if(me.password != me.passwordAnt){
                        me.actPassword = true;
                    }

                    axios.put('api/Ingresos/Actualizar',{
                        'idingreso' : me.id,
                        'idusuario' : me.idusuario,
                        'idproveedor' : me.idproveedor,
                        'tipo_documento' : me.tipo_documento,
                        'serie_documento' : me.serie_documento,
                        'num_documento' : me.num_documento,
                        'fecha_hora': me.fecha_hora,
                        'impuesto' : me.impuesto,
                        'total' : me.total
                    }, configuracion).then(function(response){
                        me.close();
                        me.listar();
                        me.limpiar();                        
                    }).catch(function(error){
                        console.log(error);
                    });
                } else {
                    //Código para guardar
                    let me=this;
                    let header = {"Authorization" : "Bearer " + this.$store.state.token};
                    let configuracion = {headers : header};
                    axios.post('api/Ingresos/Crear',{
                        'idusuario' : me.idusuario,
                        'idproveedor' : me.idproveedor,
                        'tipo_documento' : me.tipo_documento,
                        'serie_documento' : me.serie_documento,
                        'num_documento' : me.num_documento,
                        'fecha_hora': me.fecha_hora,
                        'impuesto' : me.impuesto,
                        'total' : me.total
                    }, configuracion).then(function(response){
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
                if(!this.serie_documento || this.serie_documento==""){
                    this.validaMensaje.push("Ingrese el nombre");
                }
                if(!this.num_documento || this.num_documento==0){
                    this.validaMensaje.push("Ingrese el numero de documento");
                }
                if(!this.fecha_hora || this.fecha_hora==""){
                    this.validaMensaje.push("Ingrese el fecha_hora");
                }
                if(!this.tipo_documento || this.tipo_documento==""){
                    this.validaMensaje.push("Ingrese el numero de Tipo de documento");
                }
                if(!this.impuesto || this.impuesto==""){
                    this.validaMensaje.push("Ingrese el impuesto");
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
                let header = {"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion = {headers : header};
                axios.put('api/Ingresos/Activar/'+this.adId,{}, configuracion).then(function(response){
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
                let header = {"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion = {headers : header};
                axios.put('api/Ingresos/Desactivar/'+this.adId,{}, configuracion).then(function(response){
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
