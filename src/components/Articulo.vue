
<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar text color="white">
                <v-toolbar-title>Articulos</v-toolbar-title>
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
                                    <v-select v-model="idcategoria" :items="categorias" label="Categoria">
                                    </v-select>
                                </v-flex>
                                <v-flex xs6 sm6 md6>
                                    <v-text-field v-model="codigo" label="Codigo"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="nombre" label="Nombre"></v-text-field>
                                </v-flex>
                                <v-flex xs6 sm6 md6>
                                    <v-text-field type="number" v-model="precio_venta" label="Precio de Venta"></v-text-field>
                                </v-flex>
                                <v-flex xs6 sm6 md6>
                                    <v-text-field type="number" v-model="stock" label="Stock"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="descripcion" label="Descripción"></v-text-field>
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
                :items="articulos"
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
                <td>{‌{ props.item.categoria }}</td>
                <td>{‌{ props.item.codigo }}</td>
                <td>{‌{ props.item.nombre }}</td>
                <td>{‌{ props.item.precio_venta }}</td>
                <td>{‌{ props.item.stock }}</td>
                <td>{‌{ props.item.descripcion }}</td>
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
                articulos:[],                
                dialog: false,
                headers: [
                     { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: 'Categoria', value: 'categoria' },
                    { text: 'Codigo', value: 'codigo' },
                    { text: 'Nombre', value: 'nombre' },
                    { text: 'Precio de Venta', value: 'precio_venta' },
                    { text: 'Stock', value: 'stock' },
                    { text: 'Descripción', value: 'descripcion', sortable: false  },
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
                idcategoria: '',
                categorias:[],
                codigo: '',
                nombre: '',
                precio_venta: 0,
                stock: 0,
                descripcion: '',
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
                return this.editedIndex === -1 ? 'Nuevo Articulo' : 'Actualizar articulo'
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
                axios.get('api/Articulos/Listar',configuracion).then(function(response){
                    //console.log(response);
                    me.articulos=response.data;
                }).catch(function(error){
                    console.log(error);
                });
            },
            select(){
                let me = this;
                let header = {"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion = {headers : header};
                var categoriasArray = [];
                axios.get('api/Categorias/Select',configuracion).then(function(response){
                    categoriasArray = response.data;
                    categoriasArray.map(function(x){
                        me.categorias.push(
                            {text: x.nombre, value: x.idcategoria});
                    });
                }).catch(function(error){
                    console.log(error);
                });
            },
            editItem (item) {
                this.id = item.idarticulo;
                this.idcategoria = item.idcategoria;
                this.codigo = item.codigo;
                this.nombre = item.nombre;
                this.precio_venta = item.precio_venta;
                this.stock = item.stock;
                this.descripcion = item.descripcion;
                this.editedIndex = 1;
                this.dialog = true
            },
            close () {
                this.dialog = false;
                this.limpiar();
            },
            limpiar(){
                this.id = "";
                this.idcategoria = "";
                this.codigo = "";
                this.nombre = "";
                this.precio_venta = "";
                this.stock = "";
                this.descripcion = "";
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
                    axios.put('api/Articulos/Actualizar',{
                        'idarticulo' : me.id,
                        'idcategoria' : me.idcategoria,
                        'codigo' : me.codigo,
                        'nombre' : me.nombre,
                        'precio_venta' : me.precio_venta,
                        'stock' : me.stock,
                        'descripcion': me.descripcion
                    },configuracion).then(function(response){
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
                    axios.post('api/Articulos/Crear',{
                        'idcategoria' : me.idcategoria,
                        'codigo' : me.codigo,
                        'nombre' : me.nombre,
                        'precio_venta' : me.precio_venta,
                        'stock' : me.stock,
                        'descripcion': me.descripcion
                    },configuracion).then(function(response){
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
                if(!this.idcategoria){
                    this.validaMensaje.push("Seleccione una categoría");
                }
                if(!this.stock || this.stock==0){
                    this.validaMensaje.push("Ingrese el Stock");
                }
                if(!this.precio_venta || this.precio_venta==0){
                    this.validaMensaje.push("Ingrese el Precio de venta");
                }
                if(this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida;
            },
            activarDesactivarMostrar(accion,item){
                this.adModal = 1;
                this.adNombre = item.nombre;
                this.adId = item.idarticulo;

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
                axios.put('api/Articulos/Activar/'+this.adId,{},configuracion).then(function(response){
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
                axios.put('api/Articulos/Desactivar/'+this.adId,{},configuracion).then(function(response){
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
