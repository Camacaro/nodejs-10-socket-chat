
// =======
// al conectarse alguna persona al servidor el client trae un id, como se usa en las db
//Formato de usuario
/*{
	id: 'fsdasdfasd',
	nombre: 'Jesus',
	sala: 'GrupoChat'
}*/
// ======
class Usuarios {

	constructor () {
		
		this.personas = [];

	}

	agregarPersona(id, nombre, sala){

		let persona = {id, nombre, sala};		

		this.personas.push(persona);

		return this.personas;
		//return persona;
	}

	getPersona ( id ) {
		// ========================
		// Filter es una funcion que itera cada item en el arreglo
		// las llaves del fondo es para que me retorne la primera posicion ya que sino me retorna un nuevo arreglo
		// ========================
		/*let persona = this.personas.filter( persona => {
			return persona.id === id;
		})[0];*/
		let persona = this.personas.filter( persona => persona.id === id)[0];

		// ========================
		// si encuntra una pesona retorna un objeto
		// Sino retorna undefine
		// ========================
		return persona;
	}

	getPersonas(){
		return this.personas;
	}

	getPersonasPorSala( sala ){
		let personasEnSala = this.personas.filter( persona => persona.sala === sala );

		return personasEnSala;
	}

	borrarPersona( id ){
		let personaBorrada = this.getPersona( id );

		// ========================
		// Todas las que sean diferentes del id, seran retornados 
		// O sea que excluye ese id, haciendo el efecto de haberlo borrado
		// ========================
		this.personas = this.personas.filter( persona => persona.id != id );

		return personaBorrada;
	}
}

module.exports = {
	Usuarios
}