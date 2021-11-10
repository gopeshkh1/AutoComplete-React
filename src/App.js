import { useEffect, useRef, useState } from "react";
import "./styles.css";
const marketPlace = [
	"EU",
	"NA",
	"FE",
	"India",
	"France",
	"Fuji",
	"Indonesia",
	"Italy"
];

function Autocomplete(props) {
	const [selectedItems, setSelectedItems] = useState([]);
	const inputBox = useRef();
	const inputField = useRef();

	const [inputFocused, setInputFocused] = useState(false);

	const [selectedIndex, setSelectedIndex] = useState(-1);
	const [filteredSuggestion, setFilteredSuggestion] = useState(
		props.suggestions.sort()
	);

	const [displaySuggestion, setDisplaySuggestion] = useState([]);

	const onKeyDown = (e) => {
		if (e.key === "ArrowDown") {
			console.log("key down pressed");
			setSelectedIndex((selectedIndex) => {
				let result =
					(displaySuggestion.length + (selectedIndex + 1)) %
					displaySuggestion.length;
				console.log("index selected:", result);
				return result;
			});
		} else if (e.key === "ArrowUp") {
			console.log("key up pressed");
			setSelectedIndex((selectedIndex) => {
				let result =
					(displaySuggestion.length + (selectedIndex - 1)) %
					displaySuggestion.length;
				console.log("index selected:", result);
				return result;
			});
		} else if (e.key === "Enter" && selectedIndex !== -1) {
			console.log("Enter pressed");
			let selectedValue = displaySuggestion[selectedIndex];
			setFilteredSuggestion((suggestions) =>
				suggestions.filter((suggestion) => suggestion !== selectedValue)
			);
			setSelectedItems((items) => [...items, selectedValue]);
			setSelectedIndex(-1);
			inputField.current.value = "";
		} else if (
			e.key === "Backspace" &&
			inputField.current.value === "" &&
			selectedItems.length !== 0
		) {
			let item = selectedItems.at(-1);
			removeItem(item);
		}
	};

	const removeItem = (it) => {
		console.log("removing item", it);
		setSelectedItems((items) => items.filter((item) => item !== it));
		setFilteredSuggestion((filteredSuggestion) =>
			[...filteredSuggestion, it].sort()
		);
	};

	const onTextChange = (e) => {
		let value = e.target.value;
		setDisplaySuggestion(
			filteredSuggestion.filter((suggestion) => suggestion.startsWith(value))
		);
	};

	useEffect(() => {
		setDisplaySuggestion(filteredSuggestion);
	}, [filteredSuggestion]);

	const clearAll = () => {
		setFilteredSuggestion(props.suggestions.sort());
		setSelectedItems([]);
	};

	return (
		<div>
			<div
				ref={inputBox}
				style={{
					borderWidth: 1,
					borderStyle: "solid",
					display: "flex",
					maxWidth: "fit-content"
				}}>
				{selectedItems.map((item) => (
					<div key={item} style={{ backgroundColor: "beige" }}>
						<button
							style={{ margin: 1 }}
							name={item}
							onClick={removeItem.bind(this, item)}>
							{item} <span style={{ color: "red" }}> x </span>
						</button>
					</div>
				))}
				<input
					style={{ border: "none", flexGrow: 1, outline: "none" }}
					onKeyDown={onKeyDown}
					onFocus={() => {
						setInputFocused(true);
						inputBox.current.style.borderColor = "blue";
					}}
					onBlur={() => {
						setInputFocused(false);
						inputBox.current.style.borderColor = "black";
					}}
					onChange={onTextChange}
					ref={inputField}
				/>
				<button onClick={clearAll}>x</button>
			</div>
			{inputFocused && (
				<AutocompleteMenu
					suggestions={displaySuggestion}
					selectedIndex={selectedIndex}
					width={inputBox.current?.offsetWidth - 5}
				/>
			)}
		</div>
	);
}

function AutocompleteMenu(props) {
	return (
		<div
			style={{
				listStyleType: "none",
				border: "solid",
				width: props.width,
				position: "absolute",
				zIndex: 3
			}}>
			{props.suggestions.map((suggestion, index) => {
				let style = {
					backgroundColor: "white"
				};

				if (index === props.selectedIndex) {
					style.backgroundColor = "rgba(0, 188, 255, 0.9)";
				} else if (index % 2 === 0) {
					style.backgroundColor = "grey";
				}
				return (
					<div style={style} key={suggestion}>
						{suggestion}
					</div>
				);
			})}
		</div>
	);
}

export default function App() {
	return (
		<div className="App">
			<Autocomplete suggestions={marketPlace} />
			<h1>Hello CodeSandbox</h1>
			<h2>Start editing to see some magic happen!</h2>
		</div>
	);
}
