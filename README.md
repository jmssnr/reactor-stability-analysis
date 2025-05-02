# About 

Stability analysis of a continously stirred tank reactor with an exothermic first order reaction. 

The governing model equations are the mass and energy balances expressed via the reactant conversion $X$ and the normalized temperature $\theta$:

$$
\frac{\mathrm{d}X}{\mathrm{d}t'} = - X + \mathrm{DaI}(\theta) (1-X),
$$

$$
\frac{\mathrm{d}\theta}{\mathrm{d}t'} = 1-\theta + B \mathrm{DaI}(\theta) (1-X) + \mathrm{St} (\theta_\mathrm{c} - \theta),
$$

with the Damköhler number of the first kind

$$\mathrm{DaI} = \tau k_0 \exp\left(- \frac{E_\mathrm{A}}{R T_\mathrm{in} \theta} \right),$$ 

the Stanton number

$$\mathrm{St} = \frac{U A}{\dot{V} \rho c_\mathrm{p}},$$

and 

$$
B = \frac{(-\Delta H) c_\mathrm{in}}{T_\mathrm{in} \rho c_\mathrm{p}}, \\
\theta_\mathrm{c} = \frac{T_\mathrm{c}}{T_\mathrm{in}}, \\
t' = \frac{t}{\tau},
$$

where $\tau$ is the residence time, $k_0$ is the pre-exponential factor, $E_\mathrm{A}$ is the activation energy, $R$ is the universal gas constant, $T_\mathrm{in}$ is the inlet temperature, $U$ is the heat transfer coefficient, $A$ is the jacket surface area, $\dot V$ is the volumetric flow rate, $\rho$ is the density, $c_\mathrm{p}$ is the heat capacity, $\Delta H$ is the reaction enthalpy, $c_\mathrm{in}$ is the inlet concentration, and $T_\mathrm{c}$ is the coolant temperature.

![Example](/app-example.png)