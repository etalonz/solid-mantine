# What is this?
This is a port of the React component library **Mantine**, to be used with **SolidJS**.

[Check out the original library](https://mantine.dev "Check out the original library")

[Check out SolidJS](https://www.solidjs.com/ "Check out SolidJS")

This port is based on Mantine version 5.7.2 (at least for now)

All credits regarding component styling, naming and logic, design system and other functions goes to the Mantine team.

# Status
This library is nowhere near to be production ready. Expect a lot of bugs both in component functionality and looks.

- [X] All components from mantine-core ported (they may not look and behave exactly the same but they are there)
- [X] Support for storybook
- [X] Original tests imported (not all of them passes)
- [ ] All test passing
- [ ] All demos with realtime code update imported as stories
- [ ] Extra libs ported:
	- [ ] mantine-form
	- [ ] mantine-dates
	- [ ] mantine-notifications
	- [ ] mantine-modals
- [ ] Fix bugs

# Techs
- Package management: pnpm
- Testing and running: vite/vitest

# Ported dependencies
Mantine has some dependencies, that also had to be ported to Solid. They are not created as separate libraries, because the goal was to only import the bare-minimal functionality that is required by mantine to work:
- emotion
- floating-ui

# Acknowledgments
I took some inspiration or actual code from other libraries that were already ported to SolidJS.
- [HopeUI](https://hope-ui.com/ "HopeUI"): helped implementing the polymorphic component and was a reference to other ideas on how to port React code to Solid
- [SUID](https://suid.io/ "SUID"): got the idea and code for children/component inspection + other techniques to help porting React
