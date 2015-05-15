angular.module('neonApp', [])

	.controller('mainController', function(){
		var vm = this;

		vm.message = "Demo text here inserted by me";

		vm.computers = [
			{name: "Daniel", color: "Grey", nerdness: 8},
			{name: "Joe", color: "Blue", nerdness: 5},
			{name: "Santi", color: "Geeen", nerdness: 9},
		];

		vm.computerData = {};

		vm.addComputer = function() {
			vm.computers.push({
				name: vm.computerData.name;
				color: vm.computerData.color;
				nerdness: vm.computerData.nerdness;
			});

			vm.computerData = {}; //clear the form after adding item
		}


	});