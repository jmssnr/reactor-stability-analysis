#About 

Stability analysis of a continously stirred tank reactor with an exothermic first order reaction. 

The governing model equations are the mass and energy balances expressed via the reactant conversion $X$ and the normalized temperature $\theta$
$$
\frac{\mathrm{d}X}{\mathrm{d}t'} = - X + \mathrm{DaI}(\theta) (1-X)
$$

$$
\frac{\mathrm{d}\theta}{\mathrm{d}t'} = 1-\theta + B \mathrm{DaI}(\theta) (1-X) + \mathrm{St} (\theta_\mathrm{c} - \theta)
$$

with $\mathrm{DaI} = \tau k_0 \exp\left(- \frac{E_\mathrm{A}}{R T_\mathrm{in} \theta} \right)$ as the Damköhler number of the first kind, $\mathrm{St} = \frac{U A}{\dot{V} \rho c_\mathrm{p}}$ as the Stanton number, $B = \frac{(-\Delta H) c_\mathrm{in}}{T_\mathrm{in} \rho c_\mathrm{p}}$, $\theta_\mathrm{c} = \frac{T_\mathrm{c}}{T_\mathrm{in}}$ and $t' = \frac{t}{\tau}$.

![Example]("app-example.png")