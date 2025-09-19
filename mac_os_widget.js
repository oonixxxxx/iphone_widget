// Variables used by Scriptable.

// Change these to yours
const username = "name";
const hostname = "mac"; // can no longer automatically grab device name in iOS 16

//create preferences
const WINDOW_PREFS = {
	bg: Color.dynamic(new Color("#FFFEFF"), new Color("#1E1E1E")),
	
	bgTitlebar: Color.dynamic(new Color("#F0EFF0"), new Color("#383838")),
	borderTitlebar: Color.dynamic(new Color("#DBDBDB"), new Color("#0A0A0A")),
	bgCloseButton: new Color("#FD5E57"),
	borderCloseButton: new Color("#E03E38"),
	bgMinimiseButton: new Color("#FDBE3C"),
	borderMinimiseButton: new Color("#DF9E28"),
	bgMaximiseButton: new Color("#32CB4C"),
	borderMaximiseButton: new Color("#1FAA34")
}

//create terminal preferences
const TERM_PREFS = {
	color: Color.dynamic(new Color("#00"), new Color("#FF")),
	font: {
		name: "Menlo",
		size: 16,
		sizeLockscreen: 11
	}
}

let widget = createWidget()

// Preview widget unless environment is unsupported
if (!(config.runsInWidget || config.runsInNotification)) {
	await widget.presentMedium();
	//await widget.presentAccessoryRectangular();
}

Script.setWidget(widget);
Script.complete();

function createWidget() {
	let widget = new ListWidget()
	// Light color first, dark color second
	widget.backgroundColor = WINDOW_PREFS.bg;
	widget.setPadding(0, 0, 0, 0);

	// No window chrome needed if running as a lock screen widget
	if (!config.runsInAccessoryWidget) {
		drawWindow(widget);
	}
	
	const ConsoleStack = widget.addStack();
		ConsoleStack.layoutVertically();
		// Home screen widget
		if (!config.runsInAccessoryWidget) {
			ConsoleStack.setPadding(10, 16, 0, 0);
			ConsoleStack.spacing = 8;
		}

		const datetime = new Date()
		const dateFormatter = new DateFormatter()

		writeLine(ConsoleStack, "date", true);
		dateFormatter.dateFormat = "d MMM YYYY";
		writeLine(ConsoleStack, `${dateFormatter.string(datetime)}`);

		writeLine(ConsoleStack, "time", true);
		dateFormatter.useLongTimeStyle();
		writeLine(ConsoleStack, `${dateFormatter.string(datetime)}`);
	
	widget.addSpacer();

	return widget;
}

function drawWindow(widget) {
	const TitlebarStack = widget.addStack();
			TitlebarStack.backgroundColor = WINDOW_PREFS.bgTitlebar;
			TitlebarStack.setPadding(11, 12, 0, 0);
			TitlebarStack.size = new Size(0, 34);
			TitlebarStack.layoutHorizontally();
	
	const closeStack = TitlebarStack.addStack();
		closeStack.backgroundColor = WINDOW_PREFS.bgCloseButton;
		closeStack.borderColor = WINDOW_PREFS.borderCloseButton;
		closeStack.borderWidth = 1;
		closeStack.cornerRadius = 10;
		closeStack.size = new Size(16, 16);
		
	TitlebarStack.addSpacer(8);

	const minimiseStack = TitlebarStack.addStack();
		minimiseStack.backgroundColor = WINDOW_PREFS.bgMinimiseButton;
		minimiseStack.borderColor = WINDOW_PREFS.borderMinimiseButton;
		minimiseStack.borderWidth = 1;
		minimiseStack.cornerRadius = 10;
		minimiseStack.size = new Size(16, 16);
	
	TitlebarStack.addSpacer(8);

	const maximiseStack = TitlebarStack.addStack();
		maximiseStack.backgroundColor = WINDOW_PREFS.bgMaximiseButton;
		maximiseStack.borderColor = WINDOW_PREFS.borderMaximiseButton;
		maximiseStack.borderWidth = 1;
		maximiseStack.cornerRadius = 10;
		maximiseStack.size = new Size(16, 16);

	TitlebarStack.addSpacer();

const TitlebarBorderStack = widget.addStack();
	TitlebarBorderStack.backgroundColor = WINDOW_PREFS.borderTitlebar;
	TitlebarBorderStack.setPadding(0, 0, 0, 0);
	TitlebarBorderStack.addSpacer();
	TitlebarBorderStack.size = new Size(0, 1);

widget.addSpacer(0);
}

function writeLine(console, text, userTyped = false) {
	if (userTyped) {
		text = `${username}@${hostname} ~ % ` + text;
	}
	const line = console.addText(text)
	
	if (config.runsInAccessoryWidget) {
		line.font = new Font(TERM_PREFS.font.name, TERM_PREFS.font.sizeLockscreen);
	}
	else {
		line.font = new Font(TERM_PREFS.font.name, TERM_PREFS.font.size);
	}

	line.textColor = TERM_PREFS.color;
	if (userTyped) {
		line.textOpacity = 0.5;
	}
}